import { getActiveUserProductGrantDb, type DbUserAccessGrant } from "@/lib/billing/grants";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRODUCT_CODES, type DbPrice, type DbProduct } from "./types";

const PRODUCT_SELECT =
  "id, code, name, product_type, course_id, course_variant_id, is_active, created_at";
const PRICE_SELECT =
  "id, product_id, billing_type, interval_unit, interval_count, amount_gbp, stripe_price_id, is_active, created_at";

export async function getActiveProductByCodeDb(
  productCode: string
): Promise<DbProduct | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("code", productCode)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching active product by code:", {
      productCode,
      error,
    });
    return null;
  }

  return (data as DbProduct | null) ?? null;
}

export async function getProductByIdDb(productId: string): Promise<DbProduct | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product by id:", {
      productId,
      error,
    });
    return null;
  }

  return data as DbProduct;
}

export async function getActivePricesForProductDb(productId: string): Promise<DbPrice[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("prices")
    .select(PRICE_SELECT)
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("amount_gbp", { ascending: true });

  if (error) {
    console.error("Error fetching active prices for product:", {
      productId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbPrice[];
}

export async function getActivePriceByIdDb(priceId: string): Promise<DbPrice | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("prices")
    .select(PRICE_SELECT)
    .eq("id", priceId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching active price by id:", {
      priceId,
      error,
    });
    return null;
  }

  return data as DbPrice;
}

export async function getActivePriceByStripePriceIdDb(
  stripePriceId: string
): Promise<DbPrice | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("prices")
    .select(PRICE_SELECT)
    .eq("stripe_price_id", stripePriceId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching active price by Stripe price id:", {
      stripePriceId,
      error,
    });
    return null;
  }

  return data as DbPrice;
}

export async function getActiveUpgradeableGrantsDb(
  userId: string
): Promise<Array<{ grant: DbUserAccessGrant; product: DbProduct; price: DbPrice }>> {
  const [foundationProduct, higherProduct] = await Promise.all([
    getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION),
    getActiveProductByCodeDb(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER),
  ]);

  const candidates: Array<{
    grant: DbUserAccessGrant;
    product: DbProduct;
    price: DbPrice;
  }> = [];

  for (const product of [foundationProduct, higherProduct]) {
    if (!product) continue;

    const grant = await getActiveUserProductGrantDb(userId, product.id);

    if (!grant?.price_id) {
      continue;
    }

    const price = await getActivePriceByIdDb(grant.price_id);

    if (!price) {
      continue;
    }

    candidates.push({ grant, product, price });
  }

  return candidates;
}

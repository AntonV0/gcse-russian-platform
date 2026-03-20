import { createClient } from "@/lib/supabase/server";

export type DbProduct = {
  id: string;
  code: string;
  name: string;
  product_type: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type DbUserAccessGrant = {
  id: string;
  user_id: string;
  product_id: string;
  access_mode: string;
  source: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  granted_by: string | null;
  created_at: string;
};

export async function getProductsForCourseVariantDb(
  courseSlug: string,
  variantSlug: string
) {
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseError || !course) {
    console.error("Error fetching course for products:", {
      courseSlug,
      error: courseError,
    });
    return [];
  }

  const { data: variant, error: variantError } = await supabase
    .from("course_variants")
    .select("id")
    .eq("course_id", course.id)
    .eq("slug", variantSlug)
    .maybeSingle();

  if (variantError || !variant) {
    console.error("Error fetching variant for products:", {
      courseSlug,
      variantSlug,
      error: variantError,
    });
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("course_id", course.id)
    .eq("course_variant_id", variant.id)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching products for course variant:", {
      courseSlug,
      variantSlug,
      error,
    });
    return [];
  }

  return (data ?? []) as DbProduct[];
}

export async function getCurrentUserAccessGrantsDb() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_access_grants")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching current user access grants:", error);
    return [];
  }

  return (data ?? []) as DbUserAccessGrant[];
}

export async function getCurrentCourseVariantAccessGrantDb(
  courseSlug: string,
  variantSlug: string
) {
  const products = await getProductsForCourseVariantDb(courseSlug, variantSlug);
  if (products.length === 0) return null;

  const grants = await getCurrentUserAccessGrantsDb();
  if (grants.length === 0) return null;

  const productIds = new Set(products.map((product) => product.id));
  const now = new Date();

  const validGrant = grants.find((grant) => {
    if (!productIds.has(grant.product_id)) return false;
    if (!grant.is_active) return false;

    if (grant.starts_at && new Date(grant.starts_at) > now) return false;
    if (grant.ends_at && new Date(grant.ends_at) < now) return false;

    return true;
  });

  return validGrant ?? null;
}

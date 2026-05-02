"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { grantProductAccessDb } from "@/lib/billing/grants";
import { createServiceRoleClient } from "@/lib/supabase/admin";

type TrialTier = "foundation" | "higher";

function getTrialTier(value: FormDataEntryValue | null): TrialTier | null {
  if (value === "foundation" || value === "higher") {
    return value;
  }

  return null;
}

function getProductCodeForTier(tier: TrialTier) {
  return tier === "higher" ? "gcse-russian-higher" : "gcse-russian-foundation";
}

export async function chooseTrialTierAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signup");
  }

  const tier = getTrialTier(formData.get("tier"));

  if (!tier) {
    redirect("/dashboard?error=choose-tier");
  }

  const supabase = createServiceRoleClient();
  const { data: existingGrants, error: existingGrantsError } = await supabase
    .from("user_access_grants")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (existingGrantsError) {
    console.error("Error checking existing grants before trial tier choice:", {
      userId: user.id,
      error: existingGrantsError,
    });
    redirect("/dashboard?error=trial-grant-check-failed");
  }

  if ((existingGrants ?? []).length > 0) {
    redirect("/dashboard");
  }

  const productCode = getProductCodeForTier(tier);
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("code", productCode)
    .eq("is_active", true)
    .maybeSingle();

  if (productError || !product) {
    console.error("Error loading product for trial tier choice:", {
      userId: user.id,
      productCode,
      error: productError,
    });
    redirect("/dashboard?error=trial-product-missing");
  }

  const grant = await grantProductAccessDb({
    userId: user.id,
    productId: product.id,
    accessMode: "trial",
    source: "manual",
    startsAt: new Date(),
    endsAt: null,
    grantedBy: null,
  });

  if (!grant) {
    redirect("/dashboard?error=trial-grant-failed");
  }

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  redirect("/dashboard?success=trial-started");
}

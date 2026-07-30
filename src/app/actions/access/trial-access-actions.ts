"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getTrialProductCodeForVariant } from "@/lib/billing/catalog";
import { grantProductAccessDb } from "@/lib/billing/grants";
import {
  getExistingTrialTierRedirectPath,
  getTrialTierErrorRedirectPath,
  getTrialTierSuccessRedirectPath,
} from "@/lib/onboarding/trial-tier-redirects";
import { getPostOnboardingRedirectPath } from "@/lib/auth/redirect-paths";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import {
  getOrCreateOnboardingJourneyId,
  trackOnboardingFunnelEvent,
} from "@/lib/onboarding/funnel-events";

type TrialTier = "foundation" | "higher";

function getTrialTier(value: FormDataEntryValue | null): TrialTier | null {
  if (value === "foundation" || value === "higher") {
    return value;
  }

  return null;
}

export async function chooseTrialTierAction(formData: FormData) {
  const user = await getCurrentUser();
  const source = formData.get("source");
  const isOnboarding = source === "onboarding";
  const next = getPostOnboardingRedirectPath(
    typeof formData.get("next") === "string" ? String(formData.get("next")) : null
  );

  if (!user) {
    redirect("/signup");
  }

  const tier = getTrialTier(formData.get("tier"));

  if (!tier) {
    redirect(getTrialTierErrorRedirectPath(isOnboarding, "choose-tier", next));
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
    redirect(
      getTrialTierErrorRedirectPath(isOnboarding, "trial-grant-check-failed", next, tier)
    );
  }

  if ((existingGrants ?? []).length > 0) {
    redirect(getExistingTrialTierRedirectPath(isOnboarding, next));
  }

  const productCode = getTrialProductCodeForVariant(tier);

  if (!productCode) {
    redirect(
      getTrialTierErrorRedirectPath(isOnboarding, "trial-product-missing", next, tier)
    );
  }

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
    redirect(
      getTrialTierErrorRedirectPath(isOnboarding, "trial-product-missing", next, tier)
    );
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
    redirect(
      getTrialTierErrorRedirectPath(isOnboarding, "trial-grant-failed", next, tier)
    );
  }

  const journeyId = await getOrCreateOnboardingJourneyId();
  await trackOnboardingFunnelEvent({
    journeyId,
    eventName: "tier_selected",
    userId: user.id,
    destinationPath: next,
    selectedTier: tier,
  });

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  redirect(getTrialTierSuccessRedirectPath(isOnboarding, next));
}

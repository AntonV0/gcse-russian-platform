import { createClient } from "@/lib/supabase/server";

import type { VocabularyUsageVariant } from "./vocabulary-usage-types";

export function resolveVocabularyUsageVariantFromSlug(
  variantSlug: string
): VocabularyUsageVariant | null {
  const normalized = variantSlug.trim().toLowerCase();

  if (!normalized) return null;
  if (normalized === "foundation" || normalized.includes("foundation")) {
    return "foundation";
  }
  if (normalized === "higher" || normalized.includes("higher")) {
    return "higher";
  }
  if (normalized === "volna" || normalized.includes("volna")) {
    return "volna";
  }

  return null;
}

export async function getVocabularyUsageVariantForLessonSync(params: {
  variantSlug?: string | null;
  variantId?: string | null;
}): Promise<VocabularyUsageVariant | null> {
  const fromSlug = resolveVocabularyUsageVariantFromSlug(params.variantSlug ?? "");

  if (fromSlug) {
    return fromSlug;
  }

  const variantId = params.variantId?.trim();

  if (!variantId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_variants")
    .select("slug")
    .eq("id", variantId)
    .maybeSingle();

  if (error) {
    console.error("Error resolving course variant for vocabulary usage sync:", error);
    return null;
  }

  const slug =
    data && typeof data.slug === "string" ? data.slug.trim().toLowerCase() : "";

  return resolveVocabularyUsageVariantFromSlug(slug);
}

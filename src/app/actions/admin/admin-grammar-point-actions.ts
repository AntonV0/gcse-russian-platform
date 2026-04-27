"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getBoolean,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type { DbGrammarTier } from "@/lib/grammar/grammar-helpers-db";
import { getGrammarSetByIdDb } from "@/lib/grammar/grammar-helpers-db";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "grammar-point";
}

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);

  if (!raw) return null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }

  return value;
}

function assertGrammarTier(value: string): DbGrammarTier {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid grammar tier");
}

async function requireGrammarAdmin() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }
}

async function getNextGrammarPointOrder(grammarSetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grammar_points")
    .select("sort_order")
    .eq("grammar_set_id", grammarSetId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error calculating grammar point order:", { grammarSetId, error });
    throw new Error("Failed to calculate grammar point order");
  }

  return (data?.sort_order ?? -1) + 1;
}

function getPointsPath(grammarSetId: string) {
  return `/admin/grammar/${grammarSetId}/points`;
}

export async function createGrammarPointAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const title = getTrimmedString(formData, "title");
  const slug = getOptionalString(formData, "slug") ?? slugify(title);
  const shortDescription = getOptionalString(formData, "shortDescription");
  const fullExplanation = getOptionalString(formData, "fullExplanation");
  const specReference = getOptionalString(formData, "specReference");
  const grammarTagKey = getOptionalString(formData, "grammarTagKey");
  const categoryKey = getOptionalString(formData, "categoryKey");
  const tier = assertGrammarTier(getTrimmedString(formData, "tier") || "both");
  const manualSortOrder = getOptionalNonNegativeNumber(formData, "sortOrder");
  const isPublished = getBoolean(formData, "isPublished");

  if (!grammarSetId || !title) {
    throw new Error("Missing required fields");
  }

  const sortOrder = manualSortOrder ?? (await getNextGrammarPointOrder(grammarSetId));
  const supabase = await createClient();

  const { error } = await supabase.from("grammar_points").insert({
    grammar_set_id: grammarSetId,
    title,
    slug,
    short_description: shortDescription,
    full_explanation: fullExplanation,
    spec_reference: specReference,
    grammar_tag_key: grammarTagKey,
    category_key: categoryKey,
    tier,
    sort_order: sortOrder,
    is_published: isPublished,
  });

  if (error) {
    console.error("Error creating grammar point:", { grammarSetId, error });
    throw new Error("Failed to create grammar point");
  }

  const path = getPointsPath(grammarSetId);
  revalidatePath("/admin/grammar");
  revalidatePath(path);
  revalidatePath("/grammar");
  redirect(path);
}

export async function updateGrammarPointAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const title = getTrimmedString(formData, "title");
  const slug = getOptionalString(formData, "slug") ?? slugify(title);
  const shortDescription = getOptionalString(formData, "shortDescription");
  const fullExplanation = getOptionalString(formData, "fullExplanation");
  const specReference = getOptionalString(formData, "specReference");
  const grammarTagKey = getOptionalString(formData, "grammarTagKey");
  const categoryKey = getOptionalString(formData, "categoryKey");
  const tier = assertGrammarTier(getTrimmedString(formData, "tier") || "both");
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;
  const isPublished = getBoolean(formData, "isPublished");

  if (!grammarPointId || !grammarSetId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("grammar_points")
    .update({
      title,
      slug,
      short_description: shortDescription,
      full_explanation: fullExplanation,
      spec_reference: specReference,
      grammar_tag_key: grammarTagKey,
      category_key: categoryKey,
      tier,
      sort_order: sortOrder,
      is_published: isPublished,
    })
    .eq("id", grammarPointId)
    .eq("grammar_set_id", grammarSetId);

  if (error) {
    console.error("Error updating grammar point:", {
      grammarPointId,
      grammarSetId,
      error,
    });
    throw new Error("Failed to update grammar point");
  }

  const path = getPointsPath(grammarSetId);
  revalidatePath("/admin/grammar");
  revalidatePath(path);
  revalidatePath(`/admin/grammar/${grammarSetId}/points/${grammarPointId}/edit`);
  revalidatePath("/grammar");
  redirect(path);
}

export async function deleteGrammarPointAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const grammarSetId = getTrimmedString(formData, "grammarSetId");

  if (!grammarPointId || !grammarSetId) {
    throw new Error("Missing required fields");
  }

  const grammarSet = await getGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    throw new Error("Grammar set not found");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("grammar_points")
    .delete()
    .eq("id", grammarPointId)
    .eq("grammar_set_id", grammarSetId);

  if (error) {
    console.error("Error deleting grammar point:", {
      grammarPointId,
      grammarSetId,
      error,
    });
    throw new Error("Failed to delete grammar point");
  }

  const path = getPointsPath(grammarSetId);
  revalidatePath("/admin/grammar");
  revalidatePath(path);
  revalidatePath(`/grammar/${grammarSet.slug}`);
  redirect(path);
}

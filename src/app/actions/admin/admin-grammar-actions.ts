"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getBoolean,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import type { DbGrammarTier } from "@/lib/grammar/grammar-helpers-db";

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "grammar-set";
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

export async function createGrammarSetAction(formData: FormData) {
  await requireGrammarAdmin();

  const title = getTrimmedString(formData, "title");
  const slug = getOptionalString(formData, "slug") ?? slugify(title);
  const description = getOptionalString(formData, "description");
  const themeKey = getOptionalString(formData, "themeKey");
  const topicKey = getOptionalString(formData, "topicKey");
  const tier = assertGrammarTier(getTrimmedString(formData, "tier") || "both");
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;
  const isPublished = getBoolean(formData, "isPublished");
  const isTrialVisible = getBoolean(formData, "isTrialVisible");
  const requiresPaidAccess = getBoolean(formData, "requiresPaidAccess");
  const availableInVolna = getBoolean(formData, "availableInVolna");
  const sourceKey = getOptionalString(formData, "sourceKey");
  const sourceVersion = getOptionalString(formData, "sourceVersion");
  const importKey = getOptionalString(formData, "importKey");

  if (!title) {
    throw new Error("Title is required");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("grammar_sets").insert({
    title,
    slug,
    description,
    theme_key: themeKey,
    topic_key: topicKey,
    tier,
    sort_order: sortOrder,
    is_published: isPublished,
    is_trial_visible: isTrialVisible,
    requires_paid_access: requiresPaidAccess,
    available_in_volna: availableInVolna,
    source_key: sourceKey,
    source_version: sourceVersion,
    import_key: importKey,
  });

  if (error) {
    console.error("Error creating grammar set:", error);
    throw new Error("Failed to create grammar set");
  }

  revalidatePath("/admin/grammar");
  revalidatePath("/grammar");
  redirect("/admin/grammar");
}

export async function updateGrammarSetAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const title = getTrimmedString(formData, "title");
  const slug = getOptionalString(formData, "slug") ?? slugify(title);
  const description = getOptionalString(formData, "description");
  const themeKey = getOptionalString(formData, "themeKey");
  const topicKey = getOptionalString(formData, "topicKey");
  const tier = assertGrammarTier(getTrimmedString(formData, "tier") || "both");
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;
  const isPublished = getBoolean(formData, "isPublished");
  const isTrialVisible = getBoolean(formData, "isTrialVisible");
  const requiresPaidAccess = getBoolean(formData, "requiresPaidAccess");
  const availableInVolna = getBoolean(formData, "availableInVolna");
  const sourceKey = getOptionalString(formData, "sourceKey");
  const sourceVersion = getOptionalString(formData, "sourceVersion");
  const importKey = getOptionalString(formData, "importKey");

  if (!grammarSetId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("grammar_sets")
    .update({
      title,
      slug,
      description,
      theme_key: themeKey,
      topic_key: topicKey,
      tier,
      sort_order: sortOrder,
      is_published: isPublished,
      is_trial_visible: isTrialVisible,
      requires_paid_access: requiresPaidAccess,
      available_in_volna: availableInVolna,
      source_key: sourceKey,
      source_version: sourceVersion,
      import_key: importKey,
    })
    .eq("id", grammarSetId);

  if (error) {
    console.error("Error updating grammar set:", { grammarSetId, error });
    throw new Error("Failed to update grammar set");
  }

  revalidatePath("/admin/grammar");
  revalidatePath(`/admin/grammar/${grammarSetId}/edit`);
  revalidatePath("/grammar");
  redirect("/admin/grammar");
}

export async function deleteGrammarSetAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");

  if (!grammarSetId) {
    throw new Error("Grammar set id is required");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("grammar_sets").delete().eq("id", grammarSetId);

  if (error) {
    console.error("Error deleting grammar set:", { grammarSetId, error });
    throw new Error("Failed to delete grammar set");
  }

  revalidatePath("/admin/grammar");
  revalidatePath("/grammar");
  redirect("/admin/grammar");
}

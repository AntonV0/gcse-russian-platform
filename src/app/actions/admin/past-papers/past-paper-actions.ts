"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";
import {
  pastPaperPaperNames,
  pastPaperResourceTypes,
  pastPaperTiers,
  type PastPaperPaperName,
  type PastPaperResourceType,
  type PastPaperTier,
} from "@/lib/past-papers/past-paper-helpers-db";

function validatePaperName(value: string): PastPaperPaperName {
  if (pastPaperPaperNames.includes(value as PastPaperPaperName)) {
    return value as PastPaperPaperName;
  }

  throw new Error("Invalid paper name");
}

function validateTier(value: string): PastPaperTier {
  if (pastPaperTiers.includes(value as PastPaperTier)) {
    return value as PastPaperTier;
  }

  throw new Error("Invalid tier");
}

function validateResourceType(value: string): PastPaperResourceType {
  if (pastPaperResourceTypes.includes(value as PastPaperResourceType)) {
    return value as PastPaperResourceType;
  }

  throw new Error("Invalid resource type");
}

function validateOfficialUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Official URL must be a valid URL");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Official URL must start with http or https");
  }

  return url.toString();
}

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be zero or greater`);
  }

  return value;
}

function getPastPaperPayload(formData: FormData) {
  const title = getTrimmedString(formData, "title");
  const examSeries = getTrimmedString(formData, "examSeries");
  const paperNumber = getOptionalPositiveNumber(formData, "paperNumber");
  const paperName = validatePaperName(getTrimmedString(formData, "paperName"));
  const tier = validateTier(getTrimmedString(formData, "tier"));
  const resourceType = validateResourceType(getTrimmedString(formData, "resourceType"));
  const officialUrl = validateOfficialUrl(getTrimmedString(formData, "officialUrl"));
  const sourceLabel = getOptionalString(formData, "sourceLabel") ?? "Pearson";
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;

  if (!title || !examSeries || !paperNumber) {
    throw new Error("Missing required fields");
  }

  if (paperNumber < 1 || paperNumber > 4) {
    throw new Error("Paper number must be between 1 and 4");
  }

  return {
    title,
    exam_series: examSeries,
    paper_number: paperNumber,
    paper_name: paperName,
    tier,
    resource_type: resourceType,
    official_url: officialUrl,
    source_label: sourceLabel,
    is_official: getBoolean(formData, "isOfficial"),
    sort_order: sortOrder,
    is_published: getBoolean(formData, "isPublished"),
    is_trial_visible: getBoolean(formData, "isTrialVisible"),
    requires_paid_access: getBoolean(formData, "requiresPaidAccess"),
    available_in_volna: getBoolean(formData, "availableInVolna"),
    updated_at: new Date().toISOString(),
  };
}

export async function createPastPaperResourceAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const payload = getPastPaperPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("past_paper_resources").insert(payload);

  if (error) {
    console.error("Error creating past paper resource:", { payload, error });
    throw new Error(`Failed to create past paper resource: ${error.message}`);
  }

  redirect("/admin/past-papers");
}

export async function updatePastPaperResourceAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const resourceId = getTrimmedString(formData, "resourceId");

  if (!resourceId) {
    throw new Error("Missing resource id");
  }

  const payload = getPastPaperPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("past_paper_resources")
    .update(payload)
    .eq("id", resourceId);

  if (error) {
    console.error("Error updating past paper resource:", {
      resourceId,
      payload,
      error,
    });
    throw new Error(`Failed to update past paper resource: ${error.message}`);
  }

  redirect("/admin/past-papers");
}

export async function deletePastPaperResourceAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const resourceId = getTrimmedString(formData, "resourceId");

  if (!resourceId) {
    throw new Error("Missing resource id");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("past_paper_resources")
    .delete()
    .eq("id", resourceId);

  if (error) {
    console.error("Error deleting past paper resource:", { resourceId, error });
    throw new Error(`Failed to delete past paper resource: ${error.message}`);
  }

  redirect("/admin/past-papers");
}

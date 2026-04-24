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

type PastPaperImportRow = {
  title: string;
  examSeries: string;
  paperNumber: string;
  paperName: string;
  tier: string;
  resourceType: string;
  officialUrl: string;
  sourceLabel: string;
  isOfficial: string;
  sortOrder: string;
  isPublished: string;
  isTrialVisible: string;
  requiresPaidAccess: string;
  availableInVolna: string;
};

const bulkImportColumns = [
  "title",
  "exam_series",
  "paper_number",
  "paper_name",
  "tier",
  "resource_type",
  "official_url",
  "source_label",
  "is_official",
  "sort_order",
  "is_published",
  "is_trial_visible",
  "requires_paid_access",
  "available_in_volna",
] as const;

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

function getBooleanFromString(value: string, defaultValue: boolean) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) return defaultValue;

  if (["true", "yes", "y", "1", "published"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "n", "0", "draft"].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value: ${value}`);
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

function getOptionalNonNegativeNumberFromString(value: string, fieldName: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const numberValue = Number(trimmed);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`${fieldName} must be zero or greater`);
  }

  return numberValue;
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

function parseDelimitedLine(line: string, delimiter: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (character === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current.trim());
  return values;
}

function hasHeaderRow(values: string[]) {
  const normalizedValues = values.map((value) => value.trim().toLowerCase());
  return (
    normalizedValues.includes("title") &&
    normalizedValues.includes("official_url")
  );
}

function normalizeColumnName(value: string) {
  return value.trim().toLowerCase().replaceAll(" ", "_");
}

function buildImportRowFromValues(values: string[], headers?: string[]) {
  const row: Record<string, string> = {};
  const resolvedHeaders = headers ?? [...bulkImportColumns];

  resolvedHeaders.forEach((header, index) => {
    row[normalizeColumnName(header)] = values[index] ?? "";
  });

  return {
    title: row.title ?? "",
    examSeries: row.exam_series ?? "",
    paperNumber: row.paper_number ?? "",
    paperName: row.paper_name ?? "",
    tier: row.tier ?? "",
    resourceType: row.resource_type ?? "",
    officialUrl: row.official_url ?? "",
    sourceLabel: row.source_label ?? "",
    isOfficial: row.is_official ?? "",
    sortOrder: row.sort_order ?? "",
    isPublished: row.is_published ?? "",
    isTrialVisible: row.is_trial_visible ?? "",
    requiresPaidAccess: row.requires_paid_access ?? "",
    availableInVolna: row.available_in_volna ?? "",
  } satisfies PastPaperImportRow;
}

function getBulkImportPayload(row: PastPaperImportRow, rowNumber: number) {
  const title = row.title.trim();
  const examSeries = row.examSeries.trim();
  const paperNumber = Number(row.paperNumber);
  const paperName = validatePaperName(row.paperName.trim());
  const tier = validateTier(row.tier.trim() || "both");
  const resourceType = validateResourceType(row.resourceType.trim() || "other");
  const officialUrl = validateOfficialUrl(row.officialUrl.trim());

  if (!title || !examSeries || !Number.isFinite(paperNumber)) {
    throw new Error(`Missing required fields on row ${rowNumber}`);
  }

  if (paperNumber < 1 || paperNumber > 4) {
    throw new Error(`Paper number must be between 1 and 4 on row ${rowNumber}`);
  }

  return {
    title,
    exam_series: examSeries,
    paper_number: paperNumber,
    paper_name: paperName,
    tier,
    resource_type: resourceType,
    official_url: officialUrl,
    source_label: row.sourceLabel.trim() || "Pearson",
    is_official: getBooleanFromString(row.isOfficial, true),
    sort_order: getOptionalNonNegativeNumberFromString(row.sortOrder, "sort_order") ?? 0,
    is_published: getBooleanFromString(row.isPublished, false),
    is_trial_visible: getBooleanFromString(row.isTrialVisible, true),
    requires_paid_access: getBooleanFromString(row.requiresPaidAccess, false),
    available_in_volna: getBooleanFromString(row.availableInVolna, true),
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

export async function bulkCreatePastPaperResourcesAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const rawImport = getTrimmedString(formData, "bulkImport");

  if (!rawImport) {
    throw new Error("Paste at least one row to import");
  }

  const lines = rawImport
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Paste at least one row to import");
  }

  const delimiter = lines.some((line) => line.includes("\t")) ? "\t" : ",";
  const firstValues = parseDelimitedLine(lines[0], delimiter);
  const headers = hasHeaderRow(firstValues) ? firstValues.map(normalizeColumnName) : null;
  const dataLines = headers ? lines.slice(1) : lines;

  if (dataLines.length === 0) {
    throw new Error("Bulk import needs at least one data row");
  }

  const payloads = dataLines.map((line, index) =>
    getBulkImportPayload(
      buildImportRowFromValues(parseDelimitedLine(line, delimiter), headers ?? undefined),
      headers ? index + 2 : index + 1
    )
  );

  const supabase = await createClient();
  const { error } = await supabase.from("past_paper_resources").insert(payloads);

  if (error) {
    console.error("Error bulk importing past paper resources:", {
      count: payloads.length,
      error,
    });
    throw new Error(`Failed to bulk import past paper resources: ${error.message}`);
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

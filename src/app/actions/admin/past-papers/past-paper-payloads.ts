import {
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";
import {
  validateOfficialPearsonUrl,
  validatePaperName,
  validateResourceType,
  validateTier,
} from "@/app/actions/admin/past-papers/past-paper-payload-validators";

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be zero or greater`);
  }

  return value;
}

export function getPastPaperPayload(formData: FormData) {
  const title = getTrimmedString(formData, "title");
  const examSeries = getTrimmedString(formData, "examSeries");
  const paperNumber = getOptionalPositiveNumber(formData, "paperNumber");
  const paperName = validatePaperName(getTrimmedString(formData, "paperName"));
  const tier = validateTier(getTrimmedString(formData, "tier"));
  const resourceType = validateResourceType(getTrimmedString(formData, "resourceType"));
  const isOfficial = getBoolean(formData, "isOfficial");
  const officialUrl = validateOfficialPearsonUrl(
    getTrimmedString(formData, "officialUrl"),
    isOfficial
  );
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
    is_official: isOfficial,
    sort_order: sortOrder,
    is_published: getBoolean(formData, "isPublished"),
    is_trial_visible: getBoolean(formData, "isTrialVisible"),
    requires_paid_access: getBoolean(formData, "requiresPaidAccess"),
    available_in_volna: getBoolean(formData, "availableInVolna"),
    updated_at: new Date().toISOString(),
  };
}

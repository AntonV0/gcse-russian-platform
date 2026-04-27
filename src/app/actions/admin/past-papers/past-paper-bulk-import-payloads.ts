import {
  getBooleanFromString,
  getOptionalNonNegativeNumberFromString,
  validateOfficialPearsonUrl,
  validatePaperName,
  validateResourceType,
  validateTier,
} from "@/app/actions/admin/past-papers/past-paper-payload-validators";

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
  return normalizedValues.includes("title") && normalizedValues.includes("official_url");
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
  const isOfficial = getBooleanFromString(row.isOfficial, true);
  const officialUrl = validateOfficialPearsonUrl(row.officialUrl.trim(), isOfficial);

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
    is_official: isOfficial,
    sort_order: getOptionalNonNegativeNumberFromString(row.sortOrder, "sort_order") ?? 0,
    is_published: getBooleanFromString(row.isPublished, false),
    is_trial_visible: getBooleanFromString(row.isTrialVisible, true),
    requires_paid_access: getBooleanFromString(row.requiresPaidAccess, false),
    available_in_volna: getBooleanFromString(row.availableInVolna, true),
    updated_at: new Date().toISOString(),
  };
}

export function getPastPaperBulkImportPayloads(rawImport: string) {
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

  return dataLines.map((line, index) =>
    getBulkImportPayload(
      buildImportRowFromValues(parseDelimitedLine(line, delimiter), headers ?? undefined),
      headers ? index + 2 : index + 1
    )
  );
}

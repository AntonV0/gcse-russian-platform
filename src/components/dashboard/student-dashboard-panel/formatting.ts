export function formatShortDate(value: string | null) {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function getFeedbackPreview(value: string) {
  const trimmed = value.trim();

  if (trimmed.length <= 110) return trimmed;

  return `${trimmed.slice(0, 107)}...`;
}

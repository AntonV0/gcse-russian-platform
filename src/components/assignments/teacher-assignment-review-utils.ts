export function formatAssignmentDateTime(value: string | null) {
  if (!value) return "Not submitted";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatAssignmentDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getSubmittedAtTime(value: string | null) {
  if (!value) return 0;

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getProfileName(
  profile: {
    display_name: string | null;
    full_name: string | null;
    email: string | null;
  } | null
) {
  if (!profile) return null;
  return profile.display_name || profile.full_name || profile.email || null;
}

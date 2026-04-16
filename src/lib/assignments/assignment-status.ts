export function getDueDateStatus(dueAt: string | null) {
  if (!dueAt) return "none";

  const now = new Date();
  const due = new Date(dueAt);

  if (due < now) return "overdue";

  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 48) return "soon";

  return "normal";
}

export function getDueDateClass(status: string) {
  switch (status) {
    case "overdue":
      return "text-red-600 font-medium";
    case "soon":
      return "text-yellow-600 font-medium";
    default:
      return "text-gray-600";
  }
}

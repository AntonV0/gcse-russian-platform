export type DueDateStatus = "none" | "overdue" | "soon" | "normal";

export function getDueDateStatus(
  dueAt: string | null,
  now: Date = new Date()
): DueDateStatus {
  if (!dueAt) return "none";

  const due = new Date(dueAt);

  if (due < now) return "overdue";

  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 48) return "soon";

  return "normal";
}

export function getDueDateClass(status: DueDateStatus | string) {
  switch (status) {
    case "overdue":
      return "text-[var(--danger-text)] font-medium";
    case "soon":
      return "text-[var(--warning-text)] font-medium";
    default:
      return "text-[var(--text-muted)]";
  }
}

export function getDueDateUrgency(dueAt: string | null, now: Date = new Date()) {
  const status = getDueDateStatus(dueAt, now);

  if (status === "overdue") {
    return {
      status,
      tone: "danger" as const,
      title: "Past due",
      label: "Overdue",
      description:
        "This assignment is past its due date. Submit your work as soon as you can, or check your teacher feedback if it has already been reviewed.",
    };
  }

  if (status === "soon") {
    return {
      status,
      tone: "warning" as const,
      title: "Due soon",
      label: "Due soon",
      description:
        "This assignment is due within 48 hours. Finish the tasks and save your submission before the deadline.",
    };
  }

  if (status === "none") {
    return {
      status,
      tone: "info" as const,
      title: "No due date",
      label: "No due date",
      description: "Your teacher has not set a due date for this assignment.",
    };
  }

  return {
    status,
    tone: "info" as const,
    title: "Scheduled",
    label: "Scheduled",
    description: "Use the due date to plan your homework time.",
  };
}

type Status = "not_started" | "submitted" | "reviewed" | "returned";

function getStatusConfig(status: Status) {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case "reviewed":
      return {
        label: "Reviewed",
        className: "bg-green-100 text-green-800 border-green-200",
      };
    case "returned":
      return {
        label: "Returned",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      };
    default:
      return {
        label: "Not started",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      };
  }
}

export default function StatusBadge({ status }: { status?: string | null }) {
  const normalized: Status =
    status === "submitted" || status === "reviewed" || status === "returned"
      ? status
      : "not_started";

  const { label, className } = getStatusConfig(normalized);

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

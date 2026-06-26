interface StatusBadgeProps {
  status: "pending" | "completed" | "urgent" | "in-progress" | "approved" | "rejected";
  text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const statusConfig = {
    pending: "bg-warning/20 text-warning border-warning/30",
    completed: "bg-success/20 text-success border-success/30",
    urgent: "bg-destructive/20 text-destructive border-destructive/30",
    "in-progress": "bg-primary/20 text-primary border-primary/30",
    approved: "bg-success/20 text-success border-success/30",
    rejected: "bg-destructive/20 text-destructive border-destructive/30",
  };

  const displayText =
    text ||
    status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${statusConfig[status]}`}
    >
      {displayText}
    </span>
  );
}

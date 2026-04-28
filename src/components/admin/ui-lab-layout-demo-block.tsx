import Card from "@/components/ui/card";

export function UiLabLayoutDemoBlock({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Card className={["p-4", className].filter(Boolean).join(" ")}>
      <div className="mb-2 font-semibold text-[var(--text-primary)]">{title}</div>
      <p className="text-sm app-text-muted">{description}</p>
    </Card>
  );
}

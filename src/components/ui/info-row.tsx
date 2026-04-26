import DevComponentMarker from "@/components/ui/dev-component-marker";

type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div
      className={["dev-marker-host relative text-sm leading-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="InfoRow"
          filePath="src/components/ui/info-row.tsx"
          tier="semantic"
          componentRole="Compact label-value row"
          bestFor="Small metadata rows, account facts, billing details, course attributes, and simple read-only values."
          usageExamples={[
            "Course slug row",
            "Billing renewal date",
            "User role metadata",
            "Lesson status detail",
          ]}
          notes="Use for one-off label/value pairs. Use DetailList when showing a grouped set of related facts."
        />
      ) : null}
      <span className="font-semibold text-[var(--text-primary)]">{label}:</span>{" "}
      <span className="text-[var(--text-secondary)]">{value}</span>
    </div>
  );
}

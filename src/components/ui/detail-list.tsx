import DevComponentMarker from "@/components/ui/dev-component-marker";

type DetailListItem = {
  label: string;
  value: React.ReactNode;
};

type DetailListProps = {
  items: DetailListItem[];
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function DetailList({ items, className }: DetailListProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DetailList"
          filePath="src/components/ui/detail-list.tsx"
          tier="semantic"
          componentRole="Grouped label-value detail list"
          bestFor="Inspector details, account summaries, course metadata, admin read-only panels, and compact object summaries."
          usageExamples={[
            "Course detail metadata",
            "Student account summary",
            "Billing subscription facts",
            "Lesson configuration overview",
          ]}
          notes="Use when several related facts belong together. Avoid using it for editable forms or long paragraph content."
        />
      ) : null}

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/55 px-3 py-2.5"
          >
            <dt className="app-text-meta">
              {item.label}
            </dt>
            <dd className="mt-1 app-text-body">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

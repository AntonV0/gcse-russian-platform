import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="dev-marker-host relative">
      <DevOnlyComponentMarker
        componentName="Select"
        filePath="src/components/ui/select.tsx"
        tier="primitive"
        componentRole="Native select input primitive"
        bestFor="Small, fixed option sets such as status, variant, tier, type, order, and visibility."
        usageExamples={[
          "Course variant selector",
          "Lesson status selector",
          "Block type selector",
          "Admin filter dropdown",
        ]}
        notes="Use inside FormField when labelled. Use a custom combobox later only for searchable or very large option sets."
      />

      <div className="relative">
        <select
          {...props}
          className={[
            "app-focus-ring app-form-control app-form-select appearance-none pr-11",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <path
              d="M3.5 5.25L7 8.75L10.5 5.25"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

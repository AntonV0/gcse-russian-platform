import DevComponentMarker from "@/components/ui/dev-component-marker";

type InlineActionsProps = {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "between";
  stackOnMobile?: boolean;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getAlignClass(align: NonNullable<InlineActionsProps["align"]>) {
  switch (align) {
    case "end":
      return "justify-start sm:justify-end";

    case "between":
      return "justify-between";

    case "start":
    default:
      return "justify-start";
  }
}

export default function InlineActions({
  children,
  className,
  align = "start",
  stackOnMobile = false,
}: InlineActionsProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="InlineActions"
          filePath="src/components/ui/inline-actions.tsx"
          tier="layout"
          componentRole="Inline action grouping helper"
          bestFor="Small groups of buttons, filters, row actions, header actions, and compact form action rows."
          usageExamples={[
            "Save / cancel row",
            "Filter toolbar actions",
            "Preview / edit actions",
            "Compact admin row controls",
          ]}
          notes="Use for spacing and wrapping action controls. Do not use as a content container or for unrelated navigation groups."
        />
      ) : null}

      <div
        className={[
          stackOnMobile ? "app-mobile-action-stack" : "",
          "flex flex-wrap items-center gap-2 sm:gap-3",
          getAlignClass(align),
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

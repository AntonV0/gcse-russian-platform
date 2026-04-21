"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type TableToolbarProps = {
  children: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function TableToolbar({ children, className }: TableToolbarProps) {
  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="TableToolbar"
          filePath="src/components/ui/table-toolbar.tsx"
        />
      ) : null}

      <div
        className={[
          "flex flex-col gap-3 border-b border-[var(--border)] px-5 py-4",
          "lg:flex-row lg:items-center lg:justify-between",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

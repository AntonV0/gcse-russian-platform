import DevComponentMarker from "@/components/ui/dev-component-marker";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PageContainer"
          filePath="src/components/layout/page-container.tsx"
          tier="layout"
          componentRole="Standard page width container"
          bestFor="Wrapping full page content inside the shared app width and horizontal spacing system."
          usageExamples={[
            "Platform page body",
            "Admin page content",
            "Student dashboard content",
            "Account page layout",
          ]}
          notes="Use once near the page layout boundary. Do not use for cards or nested sections."
        />
      ) : null}

      <div className="app-page w-full">{children}</div>
    </div>
  );
}

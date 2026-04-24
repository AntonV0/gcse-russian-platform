import Link from "next/link";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type LessonHeaderProps = {
  backHref: string;
  backLabel: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonDescription?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function LessonHeader({
  backHref,
  backLabel,
  moduleTitle,
  lessonTitle,
  lessonDescription,
}: LessonHeaderProps) {
  return (
    <div className="dev-marker-host relative mb-8 app-header-block">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LessonHeader"
          filePath="src/components/layout/lesson-header.tsx"
          tier="layout"
          componentRole="Lesson page heading region with module context and back navigation"
          bestFor="Student lesson pages where the current lesson needs clear module context and a route back to the module."
          usageExamples={[
            "Foundation lesson page",
            "Higher lesson page",
            "Volna assigned lesson",
            "Course/module lesson flow",
          ]}
          notes="Use for lesson-level pages only. Do not use it for admin builder headings, dashboard headings, or generic page titles."
        />
      ) : null}

      <Link href={backHref} className="app-nav-link inline-flex w-fit text-sm">
        {backLabel}
      </Link>

      <p className="app-label">{moduleTitle}</p>

      <h1 className="app-title">{lessonTitle}</h1>

      {lessonDescription ? (
        <p className="app-subtitle max-w-3xl">{lessonDescription}</p>
      ) : null}
    </div>
  );
}

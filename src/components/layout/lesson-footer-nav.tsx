import Link from "next/link";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type LessonFooterNavProps = {
  moduleHref: string;
  previousLesson?: {
    href: string;
    label: string;
  };
  nextLesson?: {
    href: string;
    label: string;
  };
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function LessonFooterNav({
  moduleHref,
  previousLesson,
  nextLesson,
}: LessonFooterNavProps) {
  return (
    <div className="dev-marker-host relative mt-8 app-surface app-section-padding">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LessonFooterNav"
          filePath="src/components/layout/lesson-footer-nav.tsx"
          tier="layout"
          componentRole="Lesson-level footer navigation for returning to a module or moving between lessons"
          bestFor="End-of-lesson navigation where students need a safe route back to the module and adjacent lesson links."
          usageExamples={[
            "Foundation module lesson sequence",
            "Higher revision lesson flow",
            "Volna assigned lesson navigation",
            "Student course progression",
          ]}
          notes="Use for lesson-to-lesson navigation. Do not use for section-step navigation inside a single lesson."
        />
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          href={moduleHref}
          className="app-btn-base app-btn-secondary px-4 py-2 text-sm"
        >
          Back to module
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row">
          {previousLesson ? (
            <Link
              href={previousLesson.href}
              className="app-btn-base app-btn-secondary px-4 py-2 text-sm"
            >
              Previous lesson: {previousLesson.label}
            </Link>
          ) : null}

          {nextLesson ? (
            <Link
              href={nextLesson.href}
              className="app-btn-base app-btn-primary px-4 py-2 text-sm"
            >
              Next lesson: {nextLesson.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

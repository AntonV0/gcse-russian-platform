import Link from "next/link";

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

export default function LessonFooterNav({
  moduleHref,
  previousLesson,
  nextLesson,
}: LessonFooterNavProps) {
  return (
    <div className="mt-8 app-surface app-section-padding">
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
              ← {previousLesson.label}
            </Link>
          ) : null}

          {nextLesson ? (
            <Link
              href={nextLesson.href}
              className="app-btn-base app-btn-primary px-4 py-2 text-sm"
            >
              {nextLesson.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

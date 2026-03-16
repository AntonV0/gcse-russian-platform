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
    <div className="mt-8 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          href={moduleHref}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back to module
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row">
          {previousLesson ? (
            <Link
              href={previousLesson.href}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              ← {previousLesson.label}
            </Link>
          ) : null}

          {nextLesson ? (
            <Link
              href={nextLesson.href}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90"
            >
              {nextLesson.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
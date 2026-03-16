import Link from "next/link";

type LessonHeaderProps = {
  backHref: string;
  backLabel: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonDescription?: string;
};

export default function LessonHeader({
  backHref,
  backLabel,
  moduleTitle,
  lessonTitle,
  lessonDescription,
}: LessonHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href={backHref}
        className="mb-4 inline-block text-sm text-gray-500 hover:text-black"
      >
        ← {backLabel}
      </Link>

      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
        {moduleTitle}
      </p>

      <h1 className="mb-3 text-3xl font-bold tracking-tight">{lessonTitle}</h1>

      {lessonDescription ? (
        <p className="max-w-3xl text-gray-600">{lessonDescription}</p>
      ) : null}
    </div>
  );
}
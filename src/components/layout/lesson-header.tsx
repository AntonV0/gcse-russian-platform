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
    <div className="mb-8 app-header-block">
      <Link
        href={backHref}
        className="mb-4 inline-block text-sm text-gray-500 hover:text-black"
      >
        ← {backLabel}
      </Link>

      <p className="app-label">{moduleTitle}</p>

      <h1 className="app-title">{lessonTitle}</h1>

      {lessonDescription ? <p className="app-subtitle">{lessonDescription}</p> : null}
    </div>
  );
}

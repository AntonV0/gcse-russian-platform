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
      <Link href={backHref} className="app-nav-link inline-flex w-fit text-sm">
        ← {backLabel}
      </Link>

      <p className="app-label">{moduleTitle}</p>

      <h1 className="app-title">{lessonTitle}</h1>

      {lessonDescription ? (
        <p className="app-subtitle max-w-3xl">{lessonDescription}</p>
      ) : null}
    </div>
  );
}

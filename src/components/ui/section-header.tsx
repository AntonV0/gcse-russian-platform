import { Heading, type HeadingLevel } from "@/components/ui/heading";

type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
};

export default function SectionHeader({
  title,
  description,
  actions,
  headingLevel = 2,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={[
        "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0">
        <Heading level={headingLevel} className="app-section-title text-lg">
          {title}
        </Heading>
        {description ? (
          <p className="mt-1 text-sm app-text-muted">{description}</p>
        ) : null}
      </div>

      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

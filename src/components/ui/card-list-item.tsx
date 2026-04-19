import Link from "next/link";
import Card from "@/components/ui/card";

type CardListItemProps = {
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  href?: string;
  className?: string;
};

function CardListItemInner({
  title,
  subtitle,
  badges,
  icon,
  actions,
  className,
}: Omit<CardListItemProps, "href">) {
  return (
    <Card interactive className={["p-4", className].filter(Boolean).join(" ")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}

            <div className="min-w-0">
              <div className="font-medium text-[var(--text-primary)]">{title}</div>
              {subtitle ? (
                <div className="mt-1 text-sm app-text-muted">{subtitle}</div>
              ) : null}
              {badges ? <div className="mt-3 flex flex-wrap gap-2">{badges}</div> : null}
            </div>
          </div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </Card>
  );
}

export default function CardListItem(props: CardListItemProps) {
  if (props.href) {
    return (
      <Link href={props.href} className="block">
        <CardListItemInner {...props} />
      </Link>
    );
  }

  return <CardListItemInner {...props} />;
}

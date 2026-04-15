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
    <div
      className={[
        "flex items-start justify-between gap-4 rounded-xl border bg-white p-4 transition hover:bg-gray-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}

          <div className="min-w-0">
            <div className="font-medium text-gray-900">{title}</div>
            {subtitle ? (
              <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
            ) : null}
            {badges ? <div className="mt-3 flex flex-wrap gap-2">{badges}</div> : null}
          </div>
        </div>
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export default function CardListItem(props: CardListItemProps) {
  if (props.href) {
    return (
      <a href={props.href} className="block">
        <CardListItemInner {...props} />
      </a>
    );
  }

  return <CardListItemInner {...props} />;
}

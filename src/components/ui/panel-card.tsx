type PanelCardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function PanelCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: PanelCardProps) {
  return (
    <section
      className={["rounded-2xl border bg-white shadow-sm", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title || description ? (
        <div className="border-b px-5 py-4">
          {title ? <h2 className="font-semibold text-gray-900">{title}</h2> : null}
          {description ? (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className={["p-5", contentClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </section>
  );
}

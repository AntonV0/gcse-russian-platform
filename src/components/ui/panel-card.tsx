import Card, { CardBody, CardHeader } from "@/components/ui/card";

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
    <Card className={className}>
      {title || description ? (
        <CardHeader>
          {title ? <h2 className="app-card-title">{title}</h2> : null}
          {description ? <p className="app-card-desc">{description}</p> : null}
        </CardHeader>
      ) : null}

      <CardBody className={contentClassName}>{children}</CardBody>
    </Card>
  );
}

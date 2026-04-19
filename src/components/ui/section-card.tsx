import Card, { CardBody, CardHeader } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function SectionCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <h2 className="app-card-title">{title}</h2>
        {description ? <p className="app-card-desc">{description}</p> : null}
      </CardHeader>

      <CardBody className={contentClassName}>{children}</CardBody>
    </Card>
  );
}

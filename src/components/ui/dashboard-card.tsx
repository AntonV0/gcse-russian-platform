import Card, { CardBody } from "@/components/ui/card";

type DashboardCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function DashboardCard({
  title,
  children,
  className,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardBody>
        {title ? <h2 className="app-card-title">{title}</h2> : null}
        <div className={[title ? "mt-2" : "", "text-sm app-text-muted"].join(" ")}>
          {children}
        </div>
      </CardBody>
    </Card>
  );
}

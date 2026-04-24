import Card, { CardBody } from "@/components/ui/card";

type UiLabSectionProps = {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function UiLabSection({
  id,
  title,
  description,
  children,
}: UiLabSectionProps) {
  return (
    <section id={id} className="scroll-mt-6">
      <Card className="app-section-padding">
        <CardBody className="space-y-4 p-0">
          <div>
            <h2 className="app-section-title">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm app-text-muted">{description}</p>
            ) : null}
          </div>

          {children}
        </CardBody>
      </Card>
    </section>
  );
}

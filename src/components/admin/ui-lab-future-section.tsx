import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";

type UiLabFutureSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  items: string[];
};

export default function UiLabFutureSection({
  id = "future-components",
  title = "Future components",
  description = "Potential additions worth extracting once the product pattern stabilises.",
  items,
}: UiLabFutureSectionProps) {
  return (
    <UiLabSection id={id} title={title} description={description}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item}>
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]">
                  <AppIcon icon="idea" size={15} />
                </span>
                <div className="min-w-0">
                  <Badge tone="muted">Potential</Badge>
                  <p className="mt-2 text-sm leading-6 app-text-muted">{item}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </UiLabSection>
  );
}

import Card, { CardBody, CardHeader } from "@/components/ui/card";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function DangerZone({ title = "Danger zone", children }: Props) {
  return (
    <Card className="border-[var(--danger-border)] bg-white">
      <CardHeader className="border-b-[var(--danger-border)] bg-[var(--danger-soft)]/50">
        <div className="font-semibold text-[var(--danger-strong)]">{title}</div>
      </CardHeader>

      <CardBody className="space-y-3 text-sm text-[var(--text-primary)]">
        {children}
      </CardBody>
    </Card>
  );
}

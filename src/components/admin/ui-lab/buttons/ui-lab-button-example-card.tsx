import type { ReactNode } from "react";
import Card, { CardBody } from "@/components/ui/card";

export default function ButtonExampleCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </div>
        {children}
      </CardBody>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import SectionCard from "@/components/ui/section-card";

type ExpandableAdminFormPanelProps = {
  id?: string;
  title: string;
  description?: string;
  collapsedDescription?: string;
  openLabel?: string;
  closedLabel?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function ExpandableAdminFormPanel({
  id,
  title,
  description,
  collapsedDescription,
  openLabel = "Hide form",
  closedLabel = "Add",
  defaultOpen = false,
  children,
}: ExpandableAdminFormPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SectionCard
      id={id}
      title={title}
      description={isOpen ? description : collapsedDescription}
      tone="muted"
      density="compact"
      actions={
        <Button
          type="button"
          variant={isOpen ? "secondary" : "primary"}
          icon={isOpen ? "up" : "create"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? openLabel : closedLabel}
        </Button>
      }
    >
      {isOpen ? children : null}
    </SectionCard>
  );
}

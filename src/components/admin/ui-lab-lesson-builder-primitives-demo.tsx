"use client";

import { useState } from "react";
import {
  Badge as BuilderBadge,
  BUILDER_FIELD_CLASS,
  CompactDisclosure,
  DragHandle,
  MiniStatPill,
  Panel,
  ToolbarButton,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import Card, { CardBody } from "@/components/ui/card";

export default function UiLabLessonBuilderPrimitivesDemo() {
  const [activeTool, setActiveTool] = useState("Move");

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
      <Panel
        title="Production builder primitives"
        description="Actual shared primitives extracted for lesson-builder screens."
      >
        <div className="flex flex-wrap gap-2">
          <BuilderBadge>Default</BuilderBadge>
          <BuilderBadge tone="info">Info</BuilderBadge>
          <BuilderBadge tone="success">Published</BuilderBadge>
          <BuilderBadge tone="warning">Needs review</BuilderBadge>
          <BuilderBadge tone="muted">Draft</BuilderBadge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DragHandle label="Drag section" />
          <DragHandle label="Active block" tone="active" />
          <MiniStatPill label="blocks" value={6} />
          <MiniStatPill label="sections" value={3} />
        </div>

        <div className="flex flex-wrap gap-2">
          {["Move", "Duplicate", "Publish"].map((tool) => (
            <ToolbarButton
              key={tool}
              isActive={activeTool === tool}
              onClick={() => setActiveTool(tool)}
            >
              {tool}
            </ToolbarButton>
          ))}
        </div>
      </Panel>

      <Card>
        <CardBody className="space-y-4">
          <div>
            <div className="font-semibold text-[var(--text-primary)]">
              Builder field class
            </div>
            <p className="mt-1 text-sm app-text-muted">
              The builder has a dedicated input class for compact editor forms until
              every editor is migrated to shared FormField primitives.
            </p>
          </div>

          <input
            className={BUILDER_FIELD_CLASS}
            defaultValue="school-routine-intro"
            aria-label="Builder canonical key"
          />

          <CompactDisclosure
            title="Section metadata"
            description="Compact disclosure used for dense editor panels."
            defaultOpen
          >
            <div className="space-y-2 text-sm app-text-muted">
              <p>Variant visibility: Higher only</p>
              <p>Canonical key: school-routine-intro</p>
            </div>
          </CompactDisclosure>
        </CardBody>
      </Card>
    </div>
  );
}

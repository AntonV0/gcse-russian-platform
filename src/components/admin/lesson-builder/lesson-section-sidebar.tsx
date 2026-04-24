"use client";

import type {
  DraggedBlockContext,
  LessonSection,
  RouteFields,
} from "@/components/admin/lesson-builder/lesson-builder-types";
import { AddSectionForm } from "@/components/admin/lesson-builder/lesson-section-sidebar/add-section-form";
import { SectionList } from "@/components/admin/lesson-builder/lesson-section-sidebar/section-list";
import { SectionTemplateList } from "@/components/admin/lesson-builder/lesson-section-sidebar/section-template-list";
import { SidebarDisclosure } from "@/components/admin/lesson-builder/lesson-section-sidebar/sidebar-primitives";

export default function LessonSectionSidebar(props: {
  sections: LessonSection[];
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  routeFields: RouteFields;
  sectionSearch: string;
  onSectionSearchChange: (value: string) => void;
  draggedBlockContext: DraggedBlockContext;
  onBlockDropComplete: () => void;
  sectionTemplateOptions: {
    id: string;
    label: string;
    description: string;
    defaultSectionTitle: string;
    defaultSectionKind: string;
    presetCount: number;
  }[];
}) {
  return (
    <div className="space-y-3">
      <SidebarDisclosure
        title="Sections"
        description="Select a section to focus the editor."
        defaultOpen
        count={props.sections.length}
      >
        <SectionList
          sections={props.sections}
          selectedSectionId={props.selectedSectionId}
          onSelectSection={props.onSelectSection}
          routeFields={props.routeFields}
          sectionSearch={props.sectionSearch}
          onSectionSearchChange={props.onSectionSearchChange}
          draggedBlockContext={props.draggedBlockContext}
          onBlockDropComplete={props.onBlockDropComplete}
        />
      </SidebarDisclosure>

      <SidebarDisclosure
        title="Section templates"
        description="Insert a ready-made section with starter blocks."
        count={props.sectionTemplateOptions.length}
        defaultOpen={false}
      >
        <div className="grid gap-3">
          <SectionTemplateList
            routeFields={props.routeFields}
            sectionTemplateOptions={props.sectionTemplateOptions}
          />
        </div>
      </SidebarDisclosure>

      <SidebarDisclosure
        title="Add section"
        description="Create a section first, then add blocks."
        defaultOpen={false}
      >
        <AddSectionForm routeFields={props.routeFields} />
      </SidebarDisclosure>
    </div>
  );
}

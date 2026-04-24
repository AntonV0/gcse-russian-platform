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
import DevComponentMarker from "@/components/ui/dev-component-marker";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

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
    <div className="dev-marker-host relative space-y-3">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LessonSectionSidebar"
          filePath="src/components/admin/lesson-builder/lesson-section-sidebar.tsx"
          tier="container"
          componentRole="Lesson-builder section sidebar for selecting sections, inserting templates, and creating new sections"
          bestFor="Admin lesson builder sidebars where section structure and template insertion need to stay close to content editing."
          usageExamples={[
            "Admin lesson builder",
            "Section template insertion",
            "Variant-aware section navigation",
            "Moving blocks between sections",
          ]}
          notes="Use inside the lesson builder workspace. Do not use it for platform sidebars or generic admin navigation."
        />
      ) : null}

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

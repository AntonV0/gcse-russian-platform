import { ToolbarButton } from "@/components/admin/lesson-builder/lesson-builder-ui";
import { getLessonBlockLabel } from "@/lib/lessons/lesson-blocks";
import type {
  LessonBlock,
  LessonSection,
} from "@/components/admin/lesson-builder/lesson-builder-types";

type LessonBuilderWorkspaceToolbarProps = {
  selectedSection: LessonSection | null;
  selectedBlock: LessonBlock | null;
  isSidebarOpen: boolean;
  isInspectorOpen: boolean;
  onToggleSidebar: () => void;
  onToggleInspector: () => void;
  onClearBlockSelection: () => void;
  onJumpToAddBlock: () => void;
};

export function getLessonBuilderLayoutClass(params: {
  isSidebarOpen: boolean;
  isInspectorOpen: boolean;
}) {
  if (params.isSidebarOpen && params.isInspectorOpen) {
    return "lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_280px] 2xl:grid-cols-[320px_minmax(0,1fr)_300px]";
  }

  if (params.isSidebarOpen && !params.isInspectorOpen) {
    return "lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]";
  }

  if (!params.isSidebarOpen && params.isInspectorOpen) {
    return "lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]";
  }

  return "xl:grid-cols-[minmax(0,1fr)]";
}

export default function LessonBuilderWorkspaceToolbar({
  selectedSection,
  selectedBlock,
  isSidebarOpen,
  isInspectorOpen,
  onToggleSidebar,
  onToggleInspector,
  onClearBlockSelection,
  onJumpToAddBlock,
}: LessonBuilderWorkspaceToolbarProps) {
  return (
    <section className="app-surface z-10 p-4 backdrop-blur-md lg:sticky lg:top-[calc(var(--site-header-height)+12px)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {selectedSection ? `Editing: ${selectedSection.title}` : "Lesson builder"}
          </div>

          <div className="mt-1 text-sm app-text-muted">
            {selectedSection
              ? `${selectedSection.blocks.length} block(s)${
                  selectedBlock
                    ? ` - Selected block: ${getLessonBlockLabel(selectedBlock.block_type)}`
                    : ""
                }`
              : "Select a section to begin."}
          </div>
        </div>

        <div className="app-mobile-action-stack flex flex-wrap gap-2">
          <ToolbarButton onClick={onToggleSidebar} isActive={isSidebarOpen}>
            {isSidebarOpen ? "Hide sections" : "Show sections"}
          </ToolbarButton>

          <ToolbarButton onClick={onToggleInspector} isActive={isInspectorOpen}>
            {isInspectorOpen ? "Hide inspector" : "Show inspector"}
          </ToolbarButton>

          <ToolbarButton onClick={onClearBlockSelection}>
            Clear block selection
          </ToolbarButton>

          <ToolbarButton onClick={onJumpToAddBlock}>Jump to add block</ToolbarButton>
        </div>
      </div>
    </section>
  );
}

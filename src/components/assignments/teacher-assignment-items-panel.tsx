import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import PanelCard from "@/components/ui/panel-card";
import { getLessonPath } from "@/lib/access/routes";
import type { getAssignmentItemsWithDetailsDb } from "@/lib/assignments/assignment-helpers-db";

type AssignmentItemWithDetails = Awaited<
  ReturnType<typeof getAssignmentItemsWithDetailsDb>
>[number];

function getItemBadge(itemType: string) {
  if (itemType === "lesson") {
    return (
      <Badge tone="info" icon="lesson">
        Lesson
      </Badge>
    );
  }

  if (itemType === "question_set") {
    return (
      <Badge tone="warning" icon="question">
        Question set
      </Badge>
    );
  }

  if (itemType === "custom_task") {
    return (
      <Badge tone="muted" icon="write">
        Custom task
      </Badge>
    );
  }

  return (
    <Badge tone="muted" icon="assignments">
      Item
    </Badge>
  );
}

function AssignmentItemRow({
  item,
  index,
}: {
  item: AssignmentItemWithDetails;
  index: number;
}) {
  if (item.item_type === "lesson" && item.lesson) {
    return (
      <CardListItem
        title={item.lesson.title}
        subtitle={item.lesson.module_title}
        badges={
          <>
            <Badge tone="muted" icon="list">
              Step {index + 1}
            </Badge>
            {getItemBadge(item.item_type)}
          </>
        }
        actions={
          <Button
            href={getLessonPath(
              item.lesson.course_slug,
              item.lesson.variant_slug,
              item.lesson.module_slug,
              item.lesson.slug
            )}
            variant="secondary"
            size="sm"
            icon="preview"
          >
            Open
          </Button>
        }
      />
    );
  }

  if (item.item_type === "question_set" && item.questionSet?.slug) {
    return (
      <CardListItem
        title={item.questionSet.title}
        subtitle={item.questionSet.description ?? undefined}
        badges={
          <>
            <Badge tone="muted" icon="list">
              Step {index + 1}
            </Badge>
            {getItemBadge(item.item_type)}
          </>
        }
        actions={
          <Button
            href={`/question-sets/${item.questionSet.slug}`}
            variant="secondary"
            size="sm"
            icon="preview"
          >
            Open
          </Button>
        }
      />
    );
  }

  return (
    <CardListItem
      title={item.item_type === "custom_task" ? "Custom task" : "Assignment item"}
      subtitle={item.custom_prompt ?? "No task text provided."}
      badges={
        <>
          <Badge tone="muted" icon="list">
            Step {index + 1}
          </Badge>
          {getItemBadge(item.item_type)}
        </>
      }
    />
  );
}

export default function TeacherAssignmentItemsPanel({
  items,
}: {
  items: AssignmentItemWithDetails[];
}) {
  return (
    <PanelCard
      className="mb-6"
      title="Assignment items"
      description="The work students were asked to complete, in order."
      tone="student"
      contentClassName="space-y-3"
    >
      {items.length === 0 ? (
        <EmptyState
          icon="assignments"
          title="No items attached"
          description="This assignment does not have any lesson, question set, or custom task items yet."
        />
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <AssignmentItemRow item={item} index={index} />
            </li>
          ))}
        </ol>
      )}
    </PanelCard>
  );
}

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import {
  getVocabularyListModeLabel,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/shared/labels";
import type { DbVocabularySet } from "@/lib/vocabulary/shared/types";

export function VocabularySetItemsSummarySection({
  vocabularySet,
}: {
  vocabularySet: DbVocabularySet;
}) {
  return (
    <>
      <OperationsHeader
        eyebrow="Vocabulary items"
        title={vocabularySet.title}
        description={
          vocabularySet.description ||
          "Manage the words and phrases inside this reusable vocabulary set."
        }
        badges={
          <>
            <Badge tone="info" icon="vocabulary">
              {getVocabularyTierLabel(vocabularySet.tier)}
            </Badge>

            <Badge tone="muted" icon="list">
              {getVocabularyListModeLabel(vocabularySet.list_mode)}
            </Badge>

            <PublishStatusBadge isPublished={vocabularySet.is_published} />
          </>
        }
        actions={
          <>
            <Button href="/admin/vocabulary" variant="secondary" icon="back">
              Back to vocabulary
            </Button>

            <Button
              href={`/admin/vocabulary/${vocabularySet.id}/edit`}
              variant="soft"
              icon="edit"
            >
              Edit set
            </Button>

            <Button
              href={`/admin/vocabulary/${vocabularySet.id}/export`}
              variant="soft"
              icon="download"
              download
              prefetch={false}
            >
              Export Markdown
            </Button>
          </>
        }
      />

      <OperationsSection muted>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div>
              <h2 className="app-heading-subsection">Set contents</h2>
              <p className="mt-2 max-w-3xl app-text-body-muted">
                Review existing entries, filter long lists, and add new vocabulary without
                leaving this management screen.
              </p>
            </div>
          </div>
        </div>
      </OperationsSection>
    </>
  );
}

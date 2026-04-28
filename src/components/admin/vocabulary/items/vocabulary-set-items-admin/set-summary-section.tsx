import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
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
      <PageHeader
        title="Vocabulary items"
        description="Manage the words and phrases inside this reusable vocabulary set."
      />

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="vocabulary">
                {getVocabularyTierLabel(vocabularySet.tier)}
              </Badge>

              <Badge tone="muted" icon="list">
                {getVocabularyListModeLabel(vocabularySet.list_mode)}
              </Badge>

              <PublishStatusBadge isPublished={vocabularySet.is_published} />
            </div>

            <div>
              <h2 className="app-heading-section">{vocabularySet.title}</h2>
              <p className="mt-2 max-w-3xl app-text-body-muted">
                {vocabularySet.description || "No description yet."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
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
          </div>
        </div>
      </section>
    </>
  );
}

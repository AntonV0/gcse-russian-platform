import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { AdminVocabularyMetadataHealth } from "@/components/admin/vocabulary/list/types";

type VocabularyMetadataHealthPanelProps = {
  metadataHealth: AdminVocabularyMetadataHealth;
};

export default function VocabularyMetadataHealthPanel({
  metadataHealth,
}: VocabularyMetadataHealthPanelProps) {
  return (
    <section className="app-surface app-section-padding">
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="app-heading-subsection">Metadata health</h2>
        <p className="app-text-body-muted">
          Import-quality checks for finding words that need better labels,
          transliteration, or coverage metadata.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          title="Unknown part of speech"
          value={metadataHealth.unknownPartOfSpeechItems}
          description={`${metadataHealth.specItems} spec items checked.`}
          icon="vocabulary"
          tone={metadataHealth.unknownPartOfSpeechItems === 0 ? "success" : "warning"}
          compact
        />
        <SummaryStatCard
          title="Missing transliteration"
          value={metadataHealth.missingTransliterationItems}
          description="Items without a student-friendly pronunciation aid."
          icon="language"
          tone={
            metadataHealth.missingTransliterationItems === 0 ? "success" : "warning"
          }
          compact
        />
        <SummaryStatCard
          title="Missing category"
          value={metadataHealth.missingCategoryItems}
          description="Items that cannot yet be filtered by category."
          icon="folder"
          tone={metadataHealth.missingCategoryItems === 0 ? "success" : "warning"}
          compact
        />
        <SummaryStatCard
          title="Duplicate canonical keys"
          value={metadataHealth.duplicateCanonicalKeys}
          description="Repeated keys worth reviewing before custom-set reuse."
          icon="duplicate"
          tone={metadataHealth.duplicateCanonicalKeys === 0 ? "success" : "warning"}
          compact
        />
      </div>
    </section>
  );
}

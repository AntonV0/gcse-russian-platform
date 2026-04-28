import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";

type VocabularyAdminIntroProps = {
  totalSets: number;
  publishedSets: number;
};

export default function VocabularyAdminIntro({
  totalSets,
  publishedSets,
}: VocabularyAdminIntroProps) {
  return (
    <PageIntroPanel
      tone="admin"
      eyebrow="Admin vocabulary"
      title="Vocabulary Management"
      description="Create, edit, publish, filter, and inspect reusable vocabulary sets for lessons and revision."
      badges={
        <>
          <Badge tone="info" icon="vocabulary">
            Vocabulary CMS
          </Badge>
          <Badge tone="muted" icon="list">
            {totalSets} set{totalSets === 1 ? "" : "s"}
          </Badge>
          <Badge tone="success" icon="published">
            {publishedSets} published
          </Badge>
        </>
      }
      actions={
        <>
          <Button href="/vocabulary" variant="secondary" icon="preview">
            Student view
          </Button>
          <Button href="/admin/vocabulary/create" variant="primary" icon="create">
            Create vocabulary set
          </Button>
        </>
      }
    />
  );
}

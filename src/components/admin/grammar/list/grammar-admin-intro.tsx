import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";

export default function GrammarAdminIntro({
  totalSets,
  publishedSets,
}: {
  totalSets: number;
  publishedSets: number;
}) {
  return (
    <PageIntroPanel
      tone="admin"
      eyebrow="Admin grammar"
      title="Grammar Management"
      description="Create structured grammar sets, points, examples, and flexible JSON-backed grammar tables."
      badges={
        <>
          <Badge tone="info" icon="grammar">
            Grammar CMS
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
        <Button href="/admin/grammar/create" variant="primary" icon="create">
          Create grammar set
        </Button>
      }
    />
  );
}

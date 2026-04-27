import { deleteGrammarPointAction } from "@/app/actions/admin/admin-grammar-point-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import PanelCard from "@/components/ui/panel-card";
import type {
  DbGrammarPoint,
  DbGrammarSet,
} from "@/lib/grammar/grammar-helpers-db";

export default function GrammarPointDangerZone({
  grammarSet,
  grammarPoint,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
}) {
  return (
    <PanelCard
      title="Danger zone"
      description="Deleting this point also removes its examples and tables."
      tone="muted"
    >
      <form action={deleteGrammarPointAction}>
        <input type="hidden" name="grammarSetId" value={grammarSet.id} />
        <input type="hidden" name="grammarPointId" value={grammarPoint.id} />
        <AdminConfirmButton
          variant="danger"
          icon="delete"
          confirmMessage={`Delete ${grammarPoint.title}? This cannot be undone.`}
        >
          Delete grammar point
        </AdminConfirmButton>
      </form>
    </PanelCard>
  );
}

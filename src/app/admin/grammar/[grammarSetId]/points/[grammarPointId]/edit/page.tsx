import { notFound } from "next/navigation";
import GrammarPointDangerZone from "@/components/admin/grammar/grammar-point-danger-zone";
import GrammarPointEditHeader from "@/components/admin/grammar/grammar-point-edit-header";
import GrammarPointExamplesPanel from "@/components/admin/grammar/grammar-point-examples-panel";
import GrammarPointMainForm from "@/components/admin/grammar/grammar-point-main-form";
import GrammarPointTablesPanel from "@/components/admin/grammar/grammar-point-tables-panel";
import { loadGrammarPointByIdDb } from "@/lib/grammar/grammar-helpers-db";

type EditGrammarPointPageProps = {
  params: Promise<{ grammarSetId: string; grammarPointId: string }>;
};

export default async function EditGrammarPointPage({
  params,
}: EditGrammarPointPageProps) {
  const { grammarSetId, grammarPointId } = await params;
  const { grammarSet, grammarPoint, examples, tables } =
    await loadGrammarPointByIdDb(grammarPointId);

  if (!grammarSet || !grammarPoint || grammarSet.id !== grammarSetId) {
    notFound();
  }

  return (
    <main className="space-y-4">
      <GrammarPointEditHeader grammarSet={grammarSet} grammarPoint={grammarPoint} />
      <GrammarPointMainForm grammarSet={grammarSet} grammarPoint={grammarPoint} />
      <GrammarPointExamplesPanel
        grammarSet={grammarSet}
        grammarPoint={grammarPoint}
        examples={examples}
      />
      <GrammarPointTablesPanel
        grammarSet={grammarSet}
        grammarPoint={grammarPoint}
        tables={tables}
      />
      <GrammarPointDangerZone grammarSet={grammarSet} grammarPoint={grammarPoint} />
    </main>
  );
}

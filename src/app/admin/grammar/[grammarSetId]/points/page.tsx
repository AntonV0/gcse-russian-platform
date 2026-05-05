import { notFound } from "next/navigation";
import GrammarSetPointsAdmin from "@/components/admin/grammar/points/grammar-set-points-admin";
import {
  getGrammarPointContentHealthByPointIdsDb,
  getGrammarPointCoverageByPointIdsDb,
  loadGrammarSetByIdDb,
} from "@/lib/grammar/grammar-helpers-db";
import type { GrammarPointAdminFilters } from "@/components/admin/grammar/points/types";

type GrammarSetPointsPageProps = {
  params: Promise<{ grammarSetId: string }>;
  searchParams?: Promise<GrammarPointAdminFilters>;
};

export default async function GrammarSetPointsPage({
  params,
  searchParams,
}: GrammarSetPointsPageProps) {
  const { grammarSetId } = await params;
  const pointFilters = (await searchParams) ?? {};
  const { grammarSet, points } = await loadGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    notFound();
  }

  const [pointCoverageById, pointContentHealthById] = await Promise.all([
    getGrammarPointCoverageByPointIdsDb(points.map((point) => point.id)),
    getGrammarPointContentHealthByPointIdsDb(points.map((point) => point.id)),
  ]);

  return (
    <GrammarSetPointsAdmin
      grammarSet={grammarSet}
      points={points}
      pointCoverageById={pointCoverageById}
      pointContentHealthById={pointContentHealthById}
      pointFilters={pointFilters}
    />
  );
}

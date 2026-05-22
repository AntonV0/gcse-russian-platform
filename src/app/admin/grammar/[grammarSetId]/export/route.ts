import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { renderGrammarMarkdownExport } from "@/lib/grammar/exports";
import {
  getGrammarExamplesByPointIdDb,
  getGrammarTablesByPointIdDb,
  loadGrammarSetByIdDb,
} from "@/lib/grammar/grammar-helpers-db";

type GrammarExportRouteContext = {
  params: Promise<{
    grammarSetId: string;
  }>;
};

export async function GET(_request: Request, { params }: GrammarExportRouteContext) {
  const canAccessAdmin = await requireAdminAccess();

  if (!canAccessAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { grammarSetId } = await params;
  const { grammarSet, points } = await loadGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    return new NextResponse("Grammar set not found", { status: 404 });
  }

  const pointsWithReviewContent = await Promise.all(
    points.map(async (point) => {
      const [examples, tables] = await Promise.all([
        getGrammarExamplesByPointIdDb(point.id),
        getGrammarTablesByPointIdDb(point.id),
      ]);

      return {
        ...point,
        examples,
        tables,
      };
    })
  );

  const exportResult = renderGrammarMarkdownExport({
    grammarSet,
    points: pointsWithReviewContent,
  });

  return new NextResponse(exportResult.markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${exportResult.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

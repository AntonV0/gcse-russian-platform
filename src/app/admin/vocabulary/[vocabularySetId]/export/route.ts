import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { renderVocabularyMarkdownExport } from "@/lib/vocabulary/exports";
import { loadVocabularySetByIdDb } from "@/lib/vocabulary/sets/loaders";

type VocabularyExportRouteContext = {
  params: Promise<{
    vocabularySetId: string;
  }>;
};

export async function GET(_request: Request, { params }: VocabularyExportRouteContext) {
  const canAccessAdmin = await requireAdminAccess();

  if (!canAccessAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { vocabularySetId } = await params;
  const { vocabularySet, lists, items } = await loadVocabularySetByIdDb(vocabularySetId, {
    scopeVariant: "all",
  });

  if (!vocabularySet) {
    return new NextResponse("Vocabulary set not found", { status: 404 });
  }

  const exportResult = renderVocabularyMarkdownExport({
    vocabularySet,
    lists,
    items,
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

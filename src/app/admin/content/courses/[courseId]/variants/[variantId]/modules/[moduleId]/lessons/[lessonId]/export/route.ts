import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getCourseByIdDb,
  getLessonByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";
import {
  getLessonVocabularyResourceKey,
  renderLessonMarkdownExport,
  type LessonExportLinkedResources,
  type LessonExportSection,
} from "@/lib/lessons/exports";
import { getLessonSectionsWithBlocksDb } from "@/lib/lessons/lesson-admin-helpers-db";
import {
  getGrammarExamplesByPointIdDb,
  getGrammarTablesByPointIdDb,
  loadGrammarSetBySlugDb,
} from "@/lib/grammar/grammar-helpers-db";
import { loadQuestionSetBySlugIncludingInactiveDb } from "@/lib/questions/question-loaders";
import { loadVocabularySetBySlugDb } from "@/lib/vocabulary/sets/loaders";

type LessonExportRouteContext = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
  }>;
};

function asText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function loadLinkedResourcesForLessonExport(
  sections: LessonExportSection[]
): Promise<LessonExportLinkedResources> {
  const vocabularyRefs = new Map<
    string,
    { vocabularySetSlug: string; vocabularyListSlug: string | null }
  >();
  const grammarSetSlugs = new Set<string>();
  const questionSetSlugs = new Set<string>();

  for (const section of sections) {
    for (const block of section.blocks) {
      const data = block.data ?? {};

      if (block.block_type === "vocabulary-set") {
        const vocabularySetSlug = asText(data.vocabularySetSlug);
        if (!vocabularySetSlug) continue;

        const vocabularyListSlug = asText(data.vocabularyListSlug);
        vocabularyRefs.set(
          getLessonVocabularyResourceKey({
            vocabularySetSlug,
            vocabularyListSlug,
          }),
          { vocabularySetSlug, vocabularyListSlug }
        );
      }

      if (block.block_type === "grammar-set") {
        const grammarSetSlug = asText(data.grammarSetSlug);
        if (grammarSetSlug) grammarSetSlugs.add(grammarSetSlug);
      }

      if (block.block_type === "question-set") {
        const questionSetSlug = asText(data.questionSetSlug);
        if (questionSetSlug) questionSetSlugs.add(questionSetSlug);
      }
    }
  }

  const [vocabularySets, grammarSets, questionSets] = await Promise.all([
    Promise.all(
      Array.from(vocabularyRefs.entries()).map(async ([key, ref]) => {
        const resource = await loadVocabularySetBySlugDb(ref.vocabularySetSlug, {
          scopeVariant: "all",
          vocabularyListSlug: ref.vocabularyListSlug,
        });

        return [key, resource] as const;
      })
    ),
    Promise.all(
      Array.from(grammarSetSlugs).map(async (grammarSetSlug) => {
        const { grammarSet, points } = await loadGrammarSetBySlugDb(grammarSetSlug, {
          scopeVariant: "all",
          useServiceRole: true,
        });

        const pointsWithReviewContent = await Promise.all(
          points.map(async (point) => {
            const [examples, tables] = await Promise.all([
              getGrammarExamplesByPointIdDb(point.id, { useServiceRole: true }),
              getGrammarTablesByPointIdDb(point.id, { useServiceRole: true }),
            ]);

            return {
              ...point,
              examples,
              tables,
            };
          })
        );

        return [
          grammarSetSlug,
          {
            grammarSet,
            points: pointsWithReviewContent,
          },
        ] as const;
      })
    ),
    Promise.all(
      Array.from(questionSetSlugs).map(async (questionSetSlug) => {
        const resource = await loadQuestionSetBySlugIncludingInactiveDb(questionSetSlug);
        return [questionSetSlug, resource] as const;
      })
    ),
  ]);

  return {
    vocabularySets: Object.fromEntries(vocabularySets),
    grammarSets: Object.fromEntries(grammarSets),
    questionSets: Object.fromEntries(questionSets),
  };
}

export async function GET(_request: Request, { params }: LessonExportRouteContext) {
  const canAccessAdmin = await requireAdminAccess();

  if (!canAccessAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { courseId, variantId, moduleId, lessonId } = await params;

  const [course, variant, module, lesson] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModuleByIdDb(moduleId),
    getLessonByIdDb(lessonId),
  ]);

  if (
    !course ||
    !variant ||
    !module ||
    !lesson ||
    variant.course_id !== course.id ||
    module.course_variant_id !== variant.id ||
    lesson.module_id !== module.id
  ) {
    return new NextResponse("Lesson not found", { status: 404 });
  }

  const sections = await getLessonSectionsWithBlocksDb(lesson.id);
  const linkedResources = await loadLinkedResourcesForLessonExport(sections);
  const exportResult = renderLessonMarkdownExport({
    course,
    variant,
    module,
    lesson,
    sections,
    linkedResources,
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

import { createClient } from "@/lib/supabase/server";
import { mapDbBlockToLessonBlock, resolveSectionKind } from "@/lib/lessons/lesson-blocks";
import type { LessonSection } from "@/types/lesson";

export type DbLessonSection = {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  section_kind: string;
  position: number;
  is_published: boolean;
  variant_visibility: "shared" | "foundation_only" | "higher_only" | "volna_only";
  canonical_section_key: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type DbLessonBlock = {
  id: string;
  lesson_section_id: string;
  block_type: string;
  position: number;
  data: Record<string, unknown>;
  is_published: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type LessonContentVariant = "foundation" | "higher" | "volna";

const LESSON_SECTION_SELECT =
  "id, lesson_id, title, description, section_kind, position, is_published, variant_visibility, canonical_section_key, settings, created_at, updated_at";
const LESSON_BLOCK_SELECT =
  "id, lesson_section_id, block_type, position, data, is_published, settings, created_at, updated_at";

export async function getLessonSectionsByLessonIdDb(
  lessonId: string
): Promise<DbLessonSection[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_sections")
    .select(LESSON_SECTION_SELECT)
    .eq("lesson_id", lessonId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson sections:", { lessonId, error });
    return [];
  }

  return (data ?? []) as DbLessonSection[];
}

function isSectionVisibleForVariant(
  variantVisibility: DbLessonSection["variant_visibility"],
  variant?: LessonContentVariant
) {
  if (!variant) return true;
  if (variantVisibility === "shared") return true;
  if (variantVisibility === "foundation_only" && variant === "foundation") return true;
  if (variantVisibility === "higher_only" && variant === "higher") return true;
  if (variantVisibility === "volna_only" && variant === "volna") return true;

  return false;
}

export async function getLessonIdsWithPublishedSectionsDb(
  lessonIds: string[],
  variant?: LessonContentVariant
): Promise<Set<string>> {
  if (lessonIds.length === 0) return new Set();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_sections")
    .select("lesson_id, variant_visibility")
    .in("lesson_id", lessonIds)
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching lesson content availability:", { lessonIds, error });
    return new Set();
  }

  return new Set(
    (data ?? [])
      .filter((section) =>
        isSectionVisibleForVariant(
          section.variant_visibility as DbLessonSection["variant_visibility"],
          variant
        )
      )
      .map((section) => section.lesson_id as string)
  );
}

export async function getLessonBlocksBySectionIdsDb(
  sectionIds: string[]
): Promise<DbLessonBlock[]> {
  if (sectionIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_blocks")
    .select(LESSON_BLOCK_SELECT)
    .in("lesson_section_id", sectionIds)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lesson blocks:", { sectionIds, error });
    return [];
  }

  return (data ?? []) as DbLessonBlock[];
}

export async function loadLessonContentByLessonIdDb(
  lessonId: string
): Promise<{ lessonId: string; sections: LessonSection[] }> {
  const sections = await getLessonSectionsByLessonIdDb(lessonId);
  const sectionIds = sections.map((section) => section.id);
  const blocks = await getLessonBlocksBySectionIdsDb(sectionIds);

  const blocksBySectionId = new Map<string, DbLessonBlock[]>();

  for (const block of blocks) {
    const current = blocksBySectionId.get(block.lesson_section_id) ?? [];
    current.push(block);
    blocksBySectionId.set(block.lesson_section_id, current);
  }

  return {
    lessonId,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description ?? undefined,
      sectionKind: resolveSectionKind(section.section_kind),
      position: section.position,
      variantVisibility: section.variant_visibility,
      canonicalSectionKey: section.canonical_section_key,
      blocks: (blocksBySectionId.get(section.id) ?? []).map(mapDbBlockToLessonBlock),
    })),
  };
}

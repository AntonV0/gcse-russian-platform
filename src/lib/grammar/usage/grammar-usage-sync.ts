import { createClient } from "@/lib/supabase/server";
import {
  getGrammarUsageVariantForLessonSync,
  resolveGrammarUsageVariantFromSlug,
} from "@/lib/grammar/usage/grammar-usage-variants";
import type {
  GrammarUsageVariant,
  LessonGrammarLinkRow,
} from "@/lib/grammar/usage/grammar-usage-types";

export type { GrammarUsageVariant } from "@/lib/grammar/usage/grammar-usage-types";
export { getGrammarUsageVariantForLessonSync, resolveGrammarUsageVariantFromSlug };

export async function syncLessonGrammarSetUsagesForLesson(params: {
  lessonId: string;
  variant: GrammarUsageVariant;
}) {
  const supabase = await createClient();

  const { data: sections, error: sectionsError } = await supabase
    .from("lesson_sections")
    .select("id")
    .eq("lesson_id", params.lessonId);

  if (sectionsError) {
    console.error("Error loading lesson sections for grammar usage sync:", sectionsError);
    throw new Error("Failed to sync lesson grammar usage");
  }

  const sectionIds = (sections ?? []).map((section) => section.id as string);
  let grammarLinkRows: LessonGrammarLinkRow[] = [];

  if (sectionIds.length > 0) {
    const { data: grammarSetBlocks, error: blocksError } = await supabase
      .from("lesson_blocks")
      .select("id, lesson_section_id, data, position")
      .in("lesson_section_id", sectionIds)
      .eq("block_type", "grammar-set");

    if (blocksError) {
      console.error(
        "Error loading lesson grammar-set blocks for usage sync:",
        blocksError
      );
      throw new Error("Failed to sync lesson grammar usage");
    }

    const blockLinks = (grammarSetBlocks ?? [])
      .map((block) => {
        if (!block || typeof block !== "object") return null;

        const data =
          "data" in block && block.data && typeof block.data === "object"
            ? (block.data as Record<string, unknown>)
            : null;
        const grammarSetSlug =
          data && typeof data.grammarSetSlug === "string"
            ? data.grammarSetSlug.trim()
            : "";

        return {
          blockId: String(block.id),
          sectionId: String(block.lesson_section_id),
          position: Number(block.position ?? 0),
          grammarSetSlug,
        };
      })
      .filter(
        (
          value
        ): value is {
          blockId: string;
          sectionId: string;
          position: number;
          grammarSetSlug: string;
        } => Boolean(value && value.grammarSetSlug)
      );

    const setSlugs = Array.from(new Set(blockLinks.map((link) => link.grammarSetSlug)));

    if (setSlugs.length > 0) {
      const { data: grammarSets, error: grammarSetsError } = await supabase
        .from("grammar_sets")
        .select("id, slug")
        .in("slug", setSlugs);

      if (grammarSetsError) {
        console.error(
          "Error loading grammar sets for lesson grammar usage sync:",
          grammarSetsError
        );
        throw new Error("Failed to sync lesson grammar usage");
      }

      const setIdBySlug = new Map(
        (grammarSets ?? [])
          .filter((set) => typeof set.id === "string" && typeof set.slug === "string")
          .map((set) => [set.slug as string, set.id as string])
      );

      grammarLinkRows = blockLinks.reduce<LessonGrammarLinkRow[]>((rows, blockLink) => {
        const grammarSetId = setIdBySlug.get(blockLink.grammarSetSlug);
        if (!grammarSetId) return rows;

        rows.push({
          lesson_id: params.lessonId,
          lesson_section_id: blockLink.sectionId,
          lesson_block_id: blockLink.blockId,
          link_type: "set",
          grammar_set_id: grammarSetId,
          variant: params.variant,
          usage_type: "lesson_block",
          position: blockLink.position,
        });

        return rows;
      }, []);
    }
  }

  const { error: deleteError } = await supabase
    .from("lesson_grammar_links")
    .delete()
    .eq("lesson_id", params.lessonId)
    .eq("variant", params.variant)
    .eq("usage_type", "lesson_block");

  if (deleteError) {
    console.error("Error clearing lesson grammar links before sync:", deleteError);
    throw new Error("Failed to sync lesson grammar usage");
  }

  if (grammarLinkRows.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("lesson_grammar_links")
    .insert(grammarLinkRows);

  if (insertError) {
    console.error("Error inserting synced lesson grammar links:", insertError);
    throw new Error("Failed to sync lesson grammar usage");
  }
}

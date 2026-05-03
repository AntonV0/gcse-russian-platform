import { createClient } from "@/lib/supabase/server";
import { isCanonicalSectionProgressTarget } from "@/lib/progress/cross-variant-sync-helpers";

type SyncCrossVariantSectionProgressParams = {
  userId: string;
  lessonId: string;
  sectionId: string;
};

type LessonSectionMetaRow = {
  id: string;
  lesson_id: string;
  canonical_section_key: string | null;
  variant_visibility: "shared" | "foundation_only" | "higher_only" | "volna_only";
  is_published: boolean;
};

type LessonRow = {
  id: string;
  module_id: string;
  slug: string;
};

type ModuleRow = {
  id: string;
  course_variant_id: string;
  slug: string;
};

type CourseVariantRow = {
  id: string;
  course_id: string;
  slug: string;
};

async function touchLessonSectionProgress(
  userId: string,
  lessonId: string,
  sectionId: string
): Promise<void> {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("lesson_section_progress")
    .select("id, visit_count")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .eq("section_id", sectionId)
    .maybeSingle();

  if (existingError) {
    console.error("Error checking synced lesson section visit:", existingError);
    return;
  }

  const now = new Date().toISOString();

  if (!existing) {
    const { error: insertError } = await supabase
      .from("lesson_section_progress")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          section_id: sectionId,
          first_visited_at: now,
          last_visited_at: now,
          visit_count: 1,
          created_at: now,
          updated_at: now,
        },
        {
          ignoreDuplicates: true,
          onConflict: "user_id,lesson_id,section_id",
        }
      );

    if (insertError) {
      console.error("Error inserting synced lesson section visit:", insertError);
    }

    return;
  }

  const { error: updateError } = await supabase
    .from("lesson_section_progress")
    .update({
      last_visited_at: now,
      updated_at: now,
      visit_count: (existing.visit_count ?? 1) + 1,
    })
    .eq("id", existing.id);

  if (updateError) {
    console.error("Error updating synced lesson section visit:", updateError);
  }
}

export async function syncFoundationSectionProgressToHigherSameLesson({
  userId,
  lessonId,
  sectionId,
}: SyncCrossVariantSectionProgressParams): Promise<void> {
  const supabase = await createClient();

  const { data: currentSection, error: currentSectionError } = await supabase
    .from("lesson_sections")
    .select("id, lesson_id, canonical_section_key, variant_visibility, is_published")
    .eq("id", sectionId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (currentSectionError || !currentSection) {
    if (currentSectionError) {
      console.error(
        "Error loading current section for cross-variant sync:",
        currentSectionError
      );
    }
    return;
  }

  const typedCurrentSection = currentSection as LessonSectionMetaRow;

  if (!typedCurrentSection.canonical_section_key) {
    return;
  }

  const { data: currentLesson, error: currentLessonError } = await supabase
    .from("lessons")
    .select("id, module_id, slug")
    .eq("id", typedCurrentSection.lesson_id)
    .maybeSingle();

  if (currentLessonError || !currentLesson) {
    if (currentLessonError) {
      console.error(
        "Error loading current lesson for cross-variant sync:",
        currentLessonError
      );
    }
    return;
  }

  const typedCurrentLesson = currentLesson as LessonRow;

  const { data: currentModule, error: currentModuleError } = await supabase
    .from("modules")
    .select("id, course_variant_id, slug")
    .eq("id", typedCurrentLesson.module_id)
    .maybeSingle();

  if (currentModuleError || !currentModule) {
    if (currentModuleError) {
      console.error(
        "Error loading current module for cross-variant sync:",
        currentModuleError
      );
    }
    return;
  }

  const typedCurrentModule = currentModule as ModuleRow;

  const { data: currentVariant, error: currentVariantError } = await supabase
    .from("course_variants")
    .select("id, course_id, slug")
    .eq("id", typedCurrentModule.course_variant_id)
    .maybeSingle();

  if (currentVariantError || !currentVariant) {
    if (currentVariantError) {
      console.error(
        "Error loading current variant for cross-variant sync:",
        currentVariantError
      );
    }
    return;
  }

  const typedCurrentVariant = currentVariant as CourseVariantRow;

  if (typedCurrentVariant.slug !== "foundation") {
    return;
  }

  const { data: higherVariant, error: higherVariantError } = await supabase
    .from("course_variants")
    .select("id, course_id, slug")
    .eq("course_id", typedCurrentVariant.course_id)
    .eq("slug", "higher")
    .maybeSingle();

  if (higherVariantError) {
    console.error(
      "Error loading higher variant for cross-variant sync:",
      higherVariantError
    );
    return;
  }

  if (!higherVariant) {
    return;
  }

  const typedHigherVariant = higherVariant as CourseVariantRow;

  const { data: targetModule, error: targetModuleError } = await supabase
    .from("modules")
    .select("id, course_variant_id, slug")
    .eq("course_variant_id", typedHigherVariant.id)
    .eq("slug", typedCurrentModule.slug)
    .maybeSingle();

  if (targetModuleError) {
    console.error(
      "Error loading higher module for cross-variant sync:",
      targetModuleError
    );
    return;
  }

  if (!targetModule) {
    return;
  }

  const typedTargetModule = targetModule as ModuleRow;

  const { data: targetLesson, error: targetLessonError } = await supabase
    .from("lessons")
    .select("id, module_id, slug")
    .eq("module_id", typedTargetModule.id)
    .eq("slug", typedCurrentLesson.slug)
    .maybeSingle();

  if (targetLessonError) {
    console.error(
      "Error loading higher lesson for cross-variant sync:",
      targetLessonError
    );
    return;
  }

  if (!targetLesson) {
    return;
  }

  const typedTargetLesson = targetLesson as LessonRow;

  const { data: targetSections, error: targetSectionsError } = await supabase
    .from("lesson_sections")
    .select("id, lesson_id, canonical_section_key, variant_visibility, is_published")
    .eq("lesson_id", typedTargetLesson.id)
    .eq("canonical_section_key", typedCurrentSection.canonical_section_key)
    .eq("is_published", true)
    .in("variant_visibility", ["shared", "higher_only"]);

  if (targetSectionsError) {
    console.error(
      "Error loading higher sections for cross-variant sync:",
      targetSectionsError
    );
    return;
  }

  const typedTargetSections = (targetSections ?? []) as LessonSectionMetaRow[];

  const matchingTargetSections = typedTargetSections.filter((targetSection) =>
    isCanonicalSectionProgressTarget(typedCurrentSection, targetSection)
  );

  for (const targetSection of matchingTargetSections) {
    await touchLessonSectionProgress(userId, typedTargetLesson.id, targetSection.id);
  }
}

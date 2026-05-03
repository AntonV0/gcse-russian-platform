import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const COURSE_SLUG = "gcse-russian";
const TESTING_MODULE_SLUG = "m00-admin-testing";
const TESTING_MODULE_TITLE = "Module 0: Admin testing lessons";
const TESTING_MODULE_DESCRIPTION =
  "Legacy and sample lessons kept for admin testing. Hidden from students and teachers.";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing environment file: ${filePath}`);
  }

  const env = {};

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    env[trimmed.slice(0, separatorIndex)] = trimmed.slice(separatorIndex + 1);
  }

  return env;
}

function requireEnv(env, key) {
  const value = env[key] ?? process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

async function maybeSingle(supabase, table, select, filters) {
  let query = supabase.from(table).select(select);

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`Lookup failed for ${table}: ${error.message}`);

  return data ?? null;
}

async function selectMany(supabase, table, select, filters) {
  let query = supabase.from(table).select(select);

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Lookup failed for ${table}: ${error.message}`);

  return data ?? [];
}

async function ensureTestingModule(supabase, courseVariantId) {
  const existing = await maybeSingle(supabase, "modules", "id", {
    course_variant_id: courseVariantId,
    slug: TESTING_MODULE_SLUG,
  });
  const values = {
    course_variant_id: courseVariantId,
    slug: TESTING_MODULE_SLUG,
    title: TESTING_MODULE_TITLE,
    description: TESTING_MODULE_DESCRIPTION,
    position: 0,
    is_published: true,
  };

  if (existing) {
    const { data, error } = await supabase
      .from("modules")
      .update(values)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw new Error(`Could not update Module 0: ${error.message}`);
    return data;
  }

  const { data, error } = await supabase.from("modules").insert(values).select("*").single();
  if (error) throw new Error(`Could not create Module 0: ${error.message}`);

  return data;
}

function makeUniqueLessonSlugs(lessons) {
  const seen = new Map();

  return lessons.map((lesson) => {
    const count = seen.get(lesson.slug) ?? 0;
    seen.set(lesson.slug, count + 1);

    if (count === 0) return lesson;

    return {
      ...lesson,
      slug: `${lesson.slug}-${lesson.source_module_slug}`,
    };
  });
}

async function moveVariantArchivedLessons(supabase, variant) {
  const testingModule = await ensureTestingModule(supabase, variant.id);
  const modules = await selectMany(supabase, "modules", "id, slug, title, position", {
    course_variant_id: variant.id,
  });
  const sourceModules = modules
    .filter((module) => module.id === testingModule.id || Number(module.position) >= 900)
    .sort((a, b) => Number(a.position) - Number(b.position));

  const lessons = [];
  for (const sourceModule of sourceModules) {
    const moduleLessons = await selectMany(
      supabase,
      "lessons",
      "id, slug, title, position",
      { module_id: sourceModule.id }
    );

    lessons.push(
      ...moduleLessons
        .sort((a, b) => Number(a.position) - Number(b.position))
        .map((lesson) => ({
          ...lesson,
          source_module_slug: sourceModule.slug,
          source_module_title: sourceModule.title,
          source_module_position: sourceModule.position,
        }))
    );
  }

  const uniqueLessons = makeUniqueLessonSlugs(lessons);

  for (const [index, lesson] of uniqueLessons.entries()) {
    const values = {
      module_id: testingModule.id,
      slug: lesson.slug,
      position: index + 1,
    };

    const { error } = await supabase.from("lessons").update(values).eq("id", lesson.id);
    if (error) {
      throw new Error(`Could not move lesson ${lesson.title}: ${error.message}`);
    }
  }

  return {
    variant: variant.slug,
    testingModule: {
      id: testingModule.id,
      slug: testingModule.slug,
      title: testingModule.title,
      position: testingModule.position,
    },
    sourceModules: sourceModules
      .filter((module) => module.id !== testingModule.id)
      .map((module) => ({
        slug: module.slug,
        title: module.title,
        position: module.position,
      })),
    movedLessons: uniqueLessons.length,
  };
}

async function main() {
  const env = readEnvFile(ENV_PATH);
  const supabase = createClient(
    requireEnv(env, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(env, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false },
    }
  );
  const course = await maybeSingle(supabase, "courses", "id, slug, title", {
    slug: COURSE_SLUG,
  });

  if (!course) throw new Error(`Course not found: ${COURSE_SLUG}`);

  const variants = await selectMany(supabase, "course_variants", "id, slug, title", {
    course_id: course.id,
  });
  const reports = [];

  for (const variant of variants.filter((item) =>
    ["foundation", "higher"].includes(item.slug)
  )) {
    reports.push(await moveVariantArchivedLessons(supabase, variant));
  }

  console.log(JSON.stringify({ course: course.slug, reports }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const COURSE_SLUG = "gcse-russian";
const SOURCE_KEY = "gcse-russian-course-map";
const DEFAULT_PREFLIGHT_PATH = path.join(ROOT, "tmp", "course-map-implementation-preflight.json");

function parseArgs(argv) {
  const args = {
    write: false,
    outPath: DEFAULT_PREFLIGHT_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--write") {
      args.write = true;
    } else if (arg === "--out") {
      args.outPath = path.resolve(ROOT, requireValue(argv, index, arg));
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function requireValue(argv, index, arg) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${arg}`);
  }

  return value;
}

function printHelp() {
  console.log(`Usage: node scripts/implement-course-map.mjs [options]

Default mode is safe and read-only. It generates a preflight report and performs no writes.

Options:
  --write       Insert/update generated course-map structure in Supabase
  --out <path>  Write preflight/write report JSON. Defaults to tmp/course-map-implementation-preflight.json
`);
}

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

function runJsonScript(scriptName, args = []) {
  const stdout = execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", scriptName), "--json", ...args],
    {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
    }
  );

  return JSON.parse(stdout);
}

async function maybeSingle(supabase, table, select, filters) {
  let query = supabase.from(table).select(select);

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(`Lookup failed for ${table}: ${error.message}`);
  }

  return data ?? null;
}

async function selectMany(supabase, table, select, filters) {
  let query = supabase.from(table).select(select);

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Lookup failed for ${table}: ${error.message}`);
  }

  return data ?? [];
}

async function insertOne(supabase, table, values) {
  const { data, error } = await supabase.from(table).insert(values).select("*").single();
  if (error) {
    throw new Error(`Insert failed for ${table}: ${error.message}`);
  }

  return data;
}

async function updateOne(supabase, table, id, values) {
  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Update failed for ${table}: ${error.message}`);
  }

  return data;
}

async function ensureByFilters(supabase, table, select, filters, values, write, reportKey, report) {
  const existing = await maybeSingle(supabase, table, select, filters);

  if (existing) {
    report.reused[reportKey] += 1;
    if (!write) return existing;
    return updateOne(supabase, table, existing.id, values);
  }

  report.created[reportKey] += 1;
  if (!write) return { id: `dry-run:${reportKey}:${report.created[reportKey]}`, ...values };
  return insertOne(supabase, table, values);
}

function buildMatchMaps(dbDryRunReport) {
  return {
    vocabularyItemIdByImportKey: new Map(
      dbDryRunReport.vocabResolution.matches.map((match) => [
        match.planned_import_key,
        match.vocabulary_item_id,
      ])
    ),
    grammarPointByNameSetTier: new Map(
      dbDryRunReport.grammarResolution.matches.map((match) => [
        grammarMatchKey(match.grammar_point, match.grammar_set, match.grammar_tier),
        match,
      ])
    ),
  };
}

function grammarMatchKey(grammarPoint, grammarSet, grammarTier) {
  return `${grammarSet}||${grammarPoint}||${grammarTier}`.toLowerCase();
}

function assertPreflightReady(dbDryRunReport) {
  if (!dbDryRunReport.readyForWriteDryRun) {
    throw new Error(`DB dry run is not ready for writes: ${dbDryRunReport.blockers.join("; ")}`);
  }

  if (dbDryRunReport.vocabResolution.unmatched.length > 0) {
    throw new Error("Cannot implement course map with unmatched vocab items");
  }

  if (dbDryRunReport.grammarResolution.unmatched.length > 0) {
    throw new Error("Cannot implement course map with unmatched grammar points");
  }

  if (dbDryRunReport.vocabResolution.occurrenceResolvedCount !== 0) {
    throw new Error("Cannot implement course map while vocab still needs occurrence-order resolution");
  }
}

async function implementCourseMap(supabase, manifest, dbDryRunReport, options) {
  assertPreflightReady(dbDryRunReport);

  if (!options.write) {
    return buildReadOnlyPreflightReport(dbDryRunReport);
  }

  const report = {
    mode: "write",
    created: emptyCounts(),
    reused: emptyCounts(),
    archived: {
      conflictingModules: 0,
    },
    skipped: {
      foundationCopiesOfHigherOnlyLessons: 34,
    },
    blockers: [],
  };
  const { vocabularyItemIdByImportKey, grammarPointByNameSetTier } =
    buildMatchMaps(dbDryRunReport);
  const course = await maybeSingle(supabase, "courses", "id, slug, title", {
    slug: COURSE_SLUG,
  });

  if (!course) {
    throw new Error(`Course not found: ${COURSE_SLUG}`);
  }

  const variantRows = await selectMany(supabase, "course_variants", "id, slug, title", {
    course_id: course.id,
  });
  const variantBySlug = new Map(variantRows.map((variant) => [variant.slug, variant]));

  for (const requiredVariant of ["foundation", "higher"]) {
    if (!variantBySlug.has(requiredVariant)) {
      throw new Error(`Course variant not found: ${requiredVariant}`);
    }
  }

  await archiveConflictingModules(
    supabase,
    manifest.modules,
    variantBySlug,
    options.write,
    report
  );

  const moduleIdByVariantSlug = new Map();
  for (const moduleRecord of manifest.modules) {
    const variant = variantBySlug.get(moduleRecord.variant);
    const savedModule = await ensureByFilters(
      supabase,
      "modules",
      "id, slug",
      {
        course_variant_id: variant.id,
        slug: moduleRecord.slug,
      },
      {
        course_variant_id: variant.id,
        slug: moduleRecord.slug,
        title: moduleRecord.title,
        description: moduleRecord.description,
        position: moduleRecord.position,
        is_published: moduleRecord.is_published,
      },
      options.write,
      "modules",
      report
    );

    moduleIdByVariantSlug.set(`${moduleRecord.variant}:${moduleRecord.slug}`, savedModule.id);
  }

  const lessonIdByImportKey = new Map();
  for (const lessonRecord of manifest.lessons) {
    const moduleId = moduleIdByVariantSlug.get(
      `${lessonRecord.variant}:${lessonRecord.module_slug}`
    );

    if (!moduleId) {
      throw new Error(`Module id not found for ${lessonRecord.variant}:${lessonRecord.module_slug}`);
    }

    const savedLesson = await ensureByFilters(
      supabase,
      "lessons",
      "id, slug",
      {
        module_id: moduleId,
        slug: lessonRecord.slug,
      },
      {
        module_id: moduleId,
        slug: lessonRecord.slug,
        title: lessonRecord.title,
        summary: lessonRecord.summary,
        lesson_type: lessonRecord.lesson_type,
        position: lessonRecord.position,
        estimated_minutes: lessonRecord.estimated_minutes,
        is_published: lessonRecord.is_published,
        is_trial_visible: lessonRecord.is_trial_visible,
        requires_paid_access: lessonRecord.requires_paid_access,
        available_in_volna: lessonRecord.available_in_volna,
        content_source: lessonRecord.content_source,
        content_key: lessonRecord.content_key,
      },
      options.write,
      "lessons",
      report
    );

    lessonIdByImportKey.set(lessonRecord.import_key, savedLesson.id);
  }

  const vocabularySetIdBySlug = new Map();
  for (const setRecord of manifest.vocabularySets) {
    const savedSet = await ensureByFilters(
      supabase,
      "vocabulary_sets",
      "id, slug",
      {
        slug: setRecord.slug,
      },
      {
        slug: setRecord.slug,
        title: setRecord.title,
        description: setRecord.description,
        theme_key: setRecord.theme_key,
        topic_key: setRecord.topic_key,
        tier: setRecord.tier,
        list_mode: setRecord.list_mode,
        set_type: setRecord.set_type,
        default_display_variant: setRecord.default_display_variant,
        is_published: setRecord.is_published,
        sort_order: setRecord.sort_order,
        source_key: setRecord.source_key,
        import_key: setRecord.import_key,
      },
      options.write,
      "vocabularySets",
      report
    );

    vocabularySetIdBySlug.set(setRecord.slug, savedSet.id);
  }

  const vocabularyListIdBySetAndSlug = new Map();
  for (const listRecord of manifest.vocabularyLists) {
    const vocabularySetId = vocabularySetIdBySlug.get(listRecord.vocabulary_set_slug);

    const savedList = await ensureByFilters(
      supabase,
      "vocabulary_lists",
      "id, slug",
      {
        vocabulary_set_id: vocabularySetId,
        slug: listRecord.slug,
      },
      {
        vocabulary_set_id: vocabularySetId,
        slug: listRecord.slug,
        title: listRecord.title,
        description: listRecord.description,
        theme_key: listRecord.theme_key,
        topic_key: listRecord.topic_key,
        tier: listRecord.tier,
        list_mode: listRecord.list_mode,
        default_display_variant: listRecord.default_display_variant,
        is_published: listRecord.is_published,
        sort_order: listRecord.sort_order,
        source_key: listRecord.source_key,
        import_key: listRecord.import_key,
      },
      options.write,
      "vocabularyLists",
      report
    );

    vocabularyListIdBySetAndSlug.set(
      `${listRecord.vocabulary_set_slug}:${listRecord.slug}`,
      savedList.id
    );
  }

  for (const itemRecord of manifest.vocabularyListItems) {
    const vocabularyListId = vocabularyListIdBySetAndSlug.get(
      `${itemRecord.vocabulary_set_slug}:${itemRecord.vocabulary_list_slug}`
    );
    const vocabularyItemId = vocabularyItemIdByImportKey.get(itemRecord.import_key);

    if (!vocabularyItemId) {
      throw new Error(`Resolved vocabulary item id not found for ${itemRecord.import_key}`);
    }

    await ensureByFilters(
      supabase,
      "vocabulary_list_items",
      "id",
      {
        vocabulary_list_id: vocabularyListId,
        vocabulary_item_id: vocabularyItemId,
      },
      {
        vocabulary_list_id: vocabularyListId,
        vocabulary_item_id: vocabularyItemId,
        position: itemRecord.position,
        tier_override: itemRecord.tier,
        import_key: itemRecord.import_key,
      },
      options.write,
      "vocabularyListItems",
      report
    );
  }

  for (const usageRecord of manifest.lessonVocabularySetUsages) {
    const lessonId = lessonIdByImportKey.get(usageRecord.lesson_import_key);
    const vocabularySetId = vocabularySetIdBySlug.get(usageRecord.vocabulary_set_slug);

    await ensureByFilters(
      supabase,
      "lesson_vocabulary_set_usages",
      "id",
      {
        lesson_id: lessonId,
        vocabulary_set_id: vocabularySetId,
        variant: usageRecord.variant,
        usage_type: usageRecord.usage_type,
      },
      {
        lesson_id: lessonId,
        vocabulary_set_id: vocabularySetId,
        variant: usageRecord.variant,
        usage_type: usageRecord.usage_type,
      },
      options.write,
      "lessonVocabularySetUsages",
      report
    );
  }

  for (const linkRecord of manifest.lessonVocabularyListLinks) {
    const lessonId = lessonIdByImportKey.get(linkRecord.lesson_import_key);
    const vocabularyListId = vocabularyListIdBySetAndSlug.get(
      `${linkRecord.vocabulary_set_slug}:${linkRecord.vocabulary_list_slug}`
    );

    await ensureByFilters(
      supabase,
      "lesson_vocabulary_links",
      "id",
      {
        lesson_id: lessonId,
        vocabulary_list_id: vocabularyListId,
        variant: linkRecord.variant,
        usage_type: linkRecord.usage_type,
      },
      {
        lesson_id: lessonId,
        vocabulary_list_id: vocabularyListId,
        link_type: "list",
        variant: linkRecord.variant,
        usage_type: linkRecord.usage_type,
        position: linkRecord.position,
      },
      options.write,
      "lessonVocabularyListLinks",
      report
    );
  }

  for (const grammarLink of manifest.lessonGrammarLinks) {
    const lessonId = lessonIdByImportKey.get(grammarLink.lesson_import_key);
    const grammarMatch = grammarPointByNameSetTier.get(
      grammarMatchKey(
        grammarLink.grammar_point,
        grammarLink.grammar_set,
        grammarLink.grammar_tier
      )
    );

    if (!grammarMatch) {
      throw new Error(`Resolved grammar point not found for ${grammarLink.import_key}`);
    }

    await ensureByFilters(
      supabase,
      "lesson_grammar_links",
      "id",
      {
        lesson_id: lessonId,
        grammar_point_id: grammarMatch.grammar_point_id,
        variant: grammarLink.variant,
        usage_type: grammarLink.usage_type,
      },
      {
        lesson_id: lessonId,
        grammar_point_id: grammarMatch.grammar_point_id,
        link_type: "point",
        variant: grammarLink.variant,
        usage_type: grammarLink.usage_type,
        position: grammarLink.position,
      },
      options.write,
      "lessonGrammarLinks",
      report
    );
  }

  return report;
}

function buildReadOnlyPreflightReport(dbDryRunReport) {
  const wouldCreate = dbDryRunReport.existingStructure.wouldCreate;
  const existingGenerated = dbDryRunReport.existingStructure.existingGenerated;

  return {
    mode: "dry-run",
    created: {
      modules: wouldCreate.modules,
      lessons: wouldCreate.lessons,
      vocabularySets: wouldCreate.vocabularySets,
      vocabularyLists: wouldCreate.vocabularyLists,
      vocabularyListItems: wouldCreate.vocabularyListItems,
      lessonVocabularySetUsages: wouldCreate.lessonVocabularySetUsages,
      lessonVocabularyListLinks: wouldCreate.lessonVocabularyListLinks,
      lessonGrammarLinks: wouldCreate.lessonGrammarLinks,
    },
    reused: {
      modules: existingGenerated.modulesBySlug,
      lessons: existingGenerated.lessonsByContentKey,
      vocabularySets: existingGenerated.vocabularySetsByImportKey,
      vocabularyLists: 0,
      vocabularyListItems: 0,
      lessonVocabularySetUsages: 0,
      lessonVocabularyListLinks: 0,
      lessonGrammarLinks: 0,
    },
    archived: {
      conflictingModules: dbDryRunReport.existingStructure.positionConflicts?.modules ?? 0,
    },
    skipped: {
      foundationCopiesOfHigherOnlyLessons: 34,
    },
    blockers: [],
  };
}

async function archiveConflictingModules(supabase, moduleRecords, variantBySlug, write, report) {
  const plannedByVariantPosition = new Map(
    moduleRecords.map((moduleRecord) => [
      `${moduleRecord.variant}:${moduleRecord.position}`,
      moduleRecord,
    ])
  );
  const generatedSlugs = new Set(
    moduleRecords.map((moduleRecord) => `${moduleRecord.variant}:${moduleRecord.slug}`)
  );

  for (const variantSlug of ["foundation", "higher"]) {
    const variant = variantBySlug.get(variantSlug);
    const modules = await selectMany(
      supabase,
      "modules",
      "id, slug, title, position",
      { course_variant_id: variant.id }
    );
    const occupiedPositions = new Set(modules.map((courseModule) => courseModule.position));

    for (const existingModule of modules) {
      const planned = plannedByVariantPosition.get(
        `${variantSlug}:${existingModule.position}`
      );

      if (!planned) continue;
      if (generatedSlugs.has(`${variantSlug}:${existingModule.slug}`)) continue;

      let archivePosition = 900 + existingModule.position;
      while (occupiedPositions.has(archivePosition)) {
        archivePosition += 1;
      }

      occupiedPositions.delete(existingModule.position);
      occupiedPositions.add(archivePosition);
      report.archived.conflictingModules += 1;

      if (write) {
        await updateOne(supabase, "modules", existingModule.id, {
          position: archivePosition,
        });
      }
    }
  }
}

function emptyCounts() {
  return {
    modules: 0,
    lessons: 0,
    vocabularySets: 0,
    vocabularyLists: 0,
    vocabularyListItems: 0,
    lessonVocabularySetUsages: 0,
    lessonVocabularyListLinks: 0,
    lessonGrammarLinks: 0,
  };
}

function writeJson(outPath, data) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function printReport(report, outPath) {
  console.log("Course-map implementation preflight");
  console.log("===================================");
  console.log(`Mode: ${report.mode}`);
  console.log("");
  console.log("Would create / created:");
  for (const [key, value] of Object.entries(report.created)) {
    console.log(`- ${key}: ${value}`);
  }
  console.log("");
  console.log("Archived / moved aside:");
  for (const [key, value] of Object.entries(report.archived ?? {})) {
    console.log(`- ${key}: ${value}`);
  }
  console.log("");
  console.log("Would reuse / reused:");
  for (const [key, value] of Object.entries(report.reused)) {
    console.log(`- ${key}: ${value}`);
  }
  console.log("");
  console.log(`Report: ${path.relative(ROOT, outPath)}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = readEnvFile(ENV_PATH);
  const supabase = createClient(
    requireEnv(env, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(env, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
  const manifest = runJsonScript("generate-course-map-dry-run.mjs");
  const dbDryRunReport = runJsonScript("course-map-db-dry-run.mjs", [
    "--out",
    path.join("tmp", "course-map-db-dry-run.json"),
  ]);
  const report = await implementCourseMap(supabase, manifest, dbDryRunReport, {
    write: args.write,
  });

  writeJson(args.outPath, report);
  printReport(report, args.outPath);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

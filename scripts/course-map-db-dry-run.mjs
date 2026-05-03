import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const DEFAULT_OUT_PATH = path.join(ROOT, "tmp", "course-map-db-dry-run.json");
const COURSE_SLUG = "gcse-russian";
const SOURCE_KEY = "gcse-russian-course-map";
const FOUNDATION = "foundation";
const HIGHER = "higher";

function parseArgs(argv) {
  const args = {
    outPath: DEFAULT_OUT_PATH,
    json: false,
    summary: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--out") {
      args.outPath = path.resolve(ROOT, requireValue(argv, index, arg));
      index += 1;
    } else if (arg === "--json") {
      args.json = true;
      args.summary = false;
    } else if (arg === "--summary") {
      args.summary = true;
      args.json = false;
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
  console.log(`Usage: node scripts/course-map-db-dry-run.mjs [options]

Options:
  --out <path>      Write the DB dry-run report to JSON. Defaults to tmp/course-map-db-dry-run.json
  --json            Print the full report as JSON
  --summary         Print a compact summary. This is the default
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

function buildMarkdownManifest() {
  const stdout = execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", "generate-course-map-dry-run.mjs"), "--json"],
    {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
    }
  );

  return JSON.parse(stdout);
}

async function fetchPages(supabase, table, select, options = {}) {
  const pageSize = options.pageSize ?? 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    let query = supabase
      .from(table)
      .select(select)
      .range(from, from + pageSize - 1);

    if (options.order) {
      query = query.order(options.order, { ascending: true });
    }

    if (options.filters) {
      for (const [column, value] of Object.entries(options.filters)) {
        query = query.eq(column, value);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch ${table}: ${error.message}`);
    }

    rows.push(...(data ?? []));

    if (!data || data.length < pageSize) {
      break;
    }
  }

  return rows;
}

async function loadDatabaseSnapshot(supabase) {
  const [
    courses,
    courseVariants,
    modules,
    lessons,
    vocabularySets,
    vocabularyLists,
    vocabularyItems,
    grammarSets,
    grammarPoints,
  ] = await Promise.all([
    fetchPages(supabase, "courses", "id, slug, title"),
    fetchPages(supabase, "course_variants", "id, course_id, slug, title"),
    fetchPages(supabase, "modules", "id, course_variant_id, slug, title, position"),
    fetchPages(supabase, "lessons", "id, module_id, slug, title, position, content_key"),
    fetchPages(
      supabase,
      "vocabulary_sets",
      "id, slug, title, set_type, source_key, import_key"
    ),
    fetchPages(
      supabase,
      "vocabulary_lists",
      "id, vocabulary_set_id, slug, title, source_key, import_key"
    ),
    fetchPages(
      supabase,
      "vocabulary_items",
      "id, vocabulary_set_id, canonical_key, russian, english, transliteration, part_of_speech, tier, source_type, source_key, source_version, source_section_ref, import_key, theme_key, topic_key, category_key, subcategory_key, position",
      { order: "position" }
    ),
    fetchPages(supabase, "grammar_sets", "id, slug, title, source_key, import_key"),
    fetchPages(
      supabase,
      "grammar_points",
      "id, grammar_set_id, slug, title, tier, category_key, grammar_tag_key, source_key, import_key, sort_order",
      { order: "sort_order" }
    ),
  ]);

  return {
    courses,
    courseVariants,
    modules,
    lessons,
    vocabularySets,
    vocabularyLists,
    vocabularyItems,
    grammarSets,
    grammarPoints,
  };
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function vocabLabelKey(item) {
  return `${normalizeText(item.russian)}||${normalizeText(item.english)}`;
}

function grammarKey(row) {
  return `${normalizeText(row.grammar_set)}||${normalizeText(row.grammar_point)}||${normalizeText(row.grammar_tier)}`;
}

function buildIndex(items, getKey) {
  const index = new Map();

  for (const item of items) {
    const key = getKey(item);
    const group = index.get(key) ?? [];
    group.push(item);
    index.set(key, group);
  }

  return index;
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function parseSourceCategorySlugs(sourceCategories) {
  if (!sourceCategories) return [];

  const aliases = new Map([
    ["food-drink-and-eating-out", ["food-drink-and-eating-out", "food-and-drink-eating-out", "daily-life-food-and-drink-eating-out"]],
    ["clothes-and-style", ["clothes-and-style", "dress-and-style"]],
    ["family-relationships-and-descriptions", ["family-relationships-and-descriptions", "relationships-characteristics", "relations-relationships-personal-physical-characteristics"]],
    ["local-area-holidays-and-travel", ["local-area-holidays-and-travel", "local-area-holiday-and-travel", "local-area-holidays-travel"]],
    ["asking-for-directions", ["asking-for-directions", "directions"]],
    ["future-aspirations-study-and-work", ["future-aspirations-study-and-work", "future-aspirations-study-work"]],
    ["international-and-global-dimension", ["international-and-global-dimension", "international-global-dimension"]],
  ]);

  return sourceCategories
    .split(";")
    .flatMap((category) => {
      const label = category.trim().replace(/\s+\(\d+\)$/, "");
      const slug = slugify(label);
      return aliases.get(slug) ?? [slug];
    })
    .filter(Boolean);
}

function candidateMatchesSourceCategories(candidate, sourceCategories) {
  const sourceSlugs = parseSourceCategorySlugs(sourceCategories);
  if (sourceSlugs.length === 0) return false;

  const haystack = [
    candidate.source_key,
    candidate.source_section_ref,
    candidate.import_key,
    candidate.theme_key,
    candidate.topic_key,
    candidate.category_key,
    candidate.subcategory_key,
  ]
    .map((value) => slugify(value))
    .join(" ");

  return sourceSlugs.some((slug) => haystack.includes(slug));
}

function getVocabViableCandidates(planned, candidates, usedCandidateIds) {
  const plannedTier = normalizeText(planned.tier);
  const plannedPartOfSpeech = normalizeText(planned.part_of_speech);

  const metadataStrict = candidates.filter((candidate) => {
    if (usedCandidateIds.has(candidate.id)) return false;
    if (candidate.source_type !== "spec_required") return false;
    if (plannedTier && normalizeText(candidate.tier) !== plannedTier) return false;
    if (
      plannedPartOfSpeech &&
      normalizeText(candidate.part_of_speech) !== plannedPartOfSpeech
    ) {
      return false;
    }
    return true;
  });

  const itemSourceStrict = metadataStrict.filter((candidate) =>
    candidateMatchesSourceCategories(candidate, planned.source_category)
  );
  const itemPositionStrict = itemSourceStrict.filter(
    (candidate) =>
      planned.source_category_item_index &&
      Number(candidate.position) === Number(planned.source_category_item_index)
  );
  const sourceStrict = metadataStrict.filter((candidate) =>
    candidateMatchesSourceCategories(candidate, planned.source_categories)
  );

  if (itemPositionStrict.length > 0) return itemPositionStrict;
  if (itemSourceStrict.length > 0) return itemSourceStrict;
  if (sourceStrict.length > 0) return sourceStrict;
  if (metadataStrict.length > 0) return metadataStrict;

  return candidates.filter((candidate) => {
    if (usedCandidateIds.has(candidate.id)) return false;
    if (plannedTier && normalizeText(candidate.tier) !== plannedTier) return false;
    if (
      plannedPartOfSpeech &&
      normalizeText(candidate.part_of_speech) !== plannedPartOfSpeech
    ) {
      return false;
    }
    return true;
  });
}

function sortVocabularyCandidates(candidates) {
  return [...candidates].sort((a, b) => {
    const aKey = [
      a.source_key ?? "",
      a.import_key ?? "",
      String(a.position ?? 0).padStart(6, "0"),
      a.id,
    ].join("|");
    const bKey = [
      b.source_key ?? "",
      b.import_key ?? "",
      String(b.position ?? 0).padStart(6, "0"),
      b.id,
    ].join("|");

    return aKey.localeCompare(bKey);
  });
}

function resolveVocabulary(manifest, db) {
  const candidatesByLabel = buildIndex(db.vocabularyItems, vocabLabelKey);
  const plannedByLabel = buildIndex(manifest.vocabularyListItems, vocabLabelKey);
  const usedCandidateIds = new Set();
  const matches = [];
  const unmatched = [];
  const ambiguous = [];
  const occurrenceResolved = [];

  for (const [key, plannedItems] of plannedByLabel.entries()) {
    const allCandidates = candidatesByLabel.get(key) ?? [];
    const plannedInHardestOrder = [...plannedItems].sort((a, b) => {
      const aCandidates = getVocabViableCandidates(a, allCandidates, usedCandidateIds);
      const bCandidates = getVocabViableCandidates(b, allCandidates, usedCandidateIds);
      return aCandidates.length - bCandidates.length;
    });

    for (const planned of plannedInHardestOrder) {
      const viable = sortVocabularyCandidates(
        getVocabViableCandidates(planned, allCandidates, usedCandidateIds)
      );

      if (viable.length === 0) {
        unmatched.push({
          import_key: planned.import_key,
          russian: planned.russian,
          english: planned.english,
          tier: planned.tier,
          part_of_speech: planned.part_of_speech,
          vocabulary_set_slug: planned.vocabulary_set_slug,
          vocabulary_list_slug: planned.vocabulary_list_slug,
          candidates_with_same_label: allCandidates.length,
        });
        continue;
      }

      const candidate = viable[0];
      usedCandidateIds.add(candidate.id);

      const resolution =
        viable.length === 1 && allCandidates.length === 1
          ? "unique_label"
          : viable.length === 1
            ? "unique_after_metadata"
            : "occurrence_order";

      const match = {
        planned_import_key: planned.import_key,
        vocabulary_item_id: candidate.id,
        resolution,
        russian: planned.russian,
        english: planned.english,
        planned_tier: planned.tier,
        db_tier: candidate.tier,
        planned_part_of_speech: planned.part_of_speech,
        db_part_of_speech: candidate.part_of_speech,
        db_source_key: candidate.source_key,
        db_import_key: candidate.import_key,
      };

      matches.push(match);

      if (resolution === "occurrence_order") {
        occurrenceResolved.push({
          ...match,
          viable_candidate_count_at_resolution: viable.length,
        });
      }
    }
  }

  for (const [key, plannedItems] of plannedByLabel.entries()) {
    const remainingCandidates = (candidatesByLabel.get(key) ?? []).filter(
      (candidate) => !usedCandidateIds.has(candidate.id)
    );

    if (remainingCandidates.length > 0 && plannedItems.length > 0) {
      ambiguous.push({
        label_key: key,
        planned_count: plannedItems.length,
        unused_matching_db_candidates: remainingCandidates.length,
      });
    }
  }

  return {
    planned: manifest.vocabularyListItems.length,
    matched: matches.length,
    unmatched,
    ambiguous,
    occurrenceResolved,
    matches,
  };
}

function resolveGrammar(manifest, db) {
  const grammarSetById = new Map(db.grammarSets.map((set) => [set.id, set]));
  const candidates = db.grammarPoints.map((point) => {
    const grammarSet = grammarSetById.get(point.grammar_set_id);
    return {
      ...point,
      grammar_set_title: grammarSet?.title ?? null,
      grammar_set_slug: grammarSet?.slug ?? null,
    };
  });
  const candidatesByKey = buildIndex(candidates, (candidate) =>
    grammarKey({
      grammar_set: candidate.grammar_set_title,
      grammar_point: candidate.title,
      grammar_tier: candidate.tier,
    })
  );
  const matches = [];
  const unmatched = [];
  const ambiguous = [];

  for (const planned of manifest.lessonGrammarLinks.filter(
    (link, index, all) =>
      all.findIndex(
        (candidate) =>
          candidate.grammar_point === link.grammar_point &&
          candidate.grammar_set === link.grammar_set &&
          candidate.grammar_tier === link.grammar_tier
      ) === index
  )) {
    const key = grammarKey(planned);
    const viable = candidatesByKey.get(key) ?? [];

    if (viable.length === 0) {
      unmatched.push({
        grammar_point: planned.grammar_point,
        grammar_set: planned.grammar_set,
        grammar_tier: planned.grammar_tier,
      });
    } else if (viable.length > 1) {
      ambiguous.push({
        grammar_point: planned.grammar_point,
        grammar_set: planned.grammar_set,
        grammar_tier: planned.grammar_tier,
        candidate_count: viable.length,
      });
    } else {
      matches.push({
        grammar_point: planned.grammar_point,
        grammar_set: planned.grammar_set,
        grammar_tier: planned.grammar_tier,
        grammar_point_id: viable[0].id,
        grammar_point_slug: viable[0].slug,
        grammar_set_slug: viable[0].grammar_set_slug,
      });
    }
  }

  return {
    planned: 132,
    matched: matches.length,
    unmatched,
    ambiguous,
    matches,
  };
}

function inspectExistingStructure(manifest, db) {
  const course = db.courses.find((row) => row.slug === COURSE_SLUG) ?? null;
  const variants = new Map(
    db.courseVariants
      .filter((variant) => variant.course_id === course?.id)
      .map((variant) => [variant.slug, variant])
  );
  const modulesByVariantAndSlug = new Map();
  const modulesByVariantAndPosition = new Map();
  const lessonsByContentKey = new Map();
  const vocabularySetBySlug = new Map(db.vocabularySets.map((set) => [set.slug, set]));
  const vocabularySetByImportKey = new Map(
    db.vocabularySets
      .filter((set) => set.source_key === SOURCE_KEY && set.import_key)
      .map((set) => [set.import_key, set])
  );

  for (const courseModule of db.modules) {
    const variant = db.courseVariants.find(
      (candidate) => candidate.id === courseModule.course_variant_id
    );
    if (!variant) continue;

    modulesByVariantAndSlug.set(`${variant.slug}:${courseModule.slug}`, courseModule);
    modulesByVariantAndPosition.set(
      `${variant.slug}:${courseModule.position}`,
      courseModule
    );
  }

  for (const lesson of db.lessons) {
    if (!lesson.content_key) continue;
    const group = lessonsByContentKey.get(lesson.content_key) ?? [];
    group.push(lesson);
    lessonsByContentKey.set(lesson.content_key, group);
  }

  const existingModules = manifest.modules.filter((courseModule) =>
    modulesByVariantAndSlug.has(`${courseModule.variant}:${courseModule.slug}`)
  );
  const existingLessonContentKeys = manifest.lessons.filter((lesson) =>
    lessonsByContentKey.has(lesson.content_key)
  );
  const existingVocabSetsBySlug = manifest.vocabularySets.filter((set) =>
    vocabularySetBySlug.has(set.slug)
  );
  const existingVocabSetsByImportKey = manifest.vocabularySets.filter((set) =>
    vocabularySetByImportKey.has(set.import_key)
  );
  const modulePositionConflicts = manifest.modules.filter((courseModule) => {
    const existing = modulesByVariantAndPosition.get(
      `${courseModule.variant}:${courseModule.position}`
    );

    return existing && existing.slug !== courseModule.slug;
  });

  return {
    course: course
      ? { found: true, id: course.id, slug: course.slug, title: course.title }
      : { found: false, slug: COURSE_SLUG },
    variants: {
      foundation: Boolean(variants.get(FOUNDATION)),
      higher: Boolean(variants.get(HIGHER)),
    },
    existingGenerated: {
      modulesBySlug: existingModules.length,
      lessonsByContentKey: existingLessonContentKeys.length,
      vocabularySetsBySlug: existingVocabSetsBySlug.length,
      vocabularySetsByImportKey: existingVocabSetsByImportKey.length,
    },
    positionConflicts: {
      modules: modulePositionConflicts.length,
      moduleDetails: modulePositionConflicts.map((courseModule) => {
        const existing = modulesByVariantAndPosition.get(
          `${courseModule.variant}:${courseModule.position}`
        );

        return {
          variant: courseModule.variant,
          plannedSlug: courseModule.slug,
          plannedPosition: courseModule.position,
          existingSlug: existing?.slug ?? null,
          existingTitle: existing?.title ?? null,
        };
      }),
    },
    wouldCreate: {
      modules: manifest.modules.length - existingModules.length,
      lessons: manifest.lessons.length - existingLessonContentKeys.length,
      vocabularySets: manifest.vocabularySets.length - existingVocabSetsByImportKey.length,
      vocabularyLists: manifest.vocabularyLists.length,
      vocabularyListItems: manifest.vocabularyListItems.length,
      lessonVocabularySetUsages: manifest.lessonVocabularySetUsages.length,
      lessonVocabularyListLinks: manifest.lessonVocabularyListLinks.length,
      lessonGrammarLinks: manifest.lessonGrammarLinks.length,
    },
  };
}

function buildReport(manifest, db) {
  const vocabResolution = resolveVocabulary(manifest, db);
  const grammarResolution = resolveGrammar(manifest, db);
  const existingStructure = inspectExistingStructure(manifest, db);
  const blockers = [];

  if (!existingStructure.course.found) {
    blockers.push(`Course not found: ${COURSE_SLUG}`);
  }

  if (!existingStructure.variants.foundation) {
    blockers.push("Foundation course variant not found");
  }

  if (!existingStructure.variants.higher) {
    blockers.push("Higher course variant not found");
  }

  if (vocabResolution.unmatched.length > 0) {
    blockers.push(`${vocabResolution.unmatched.length} planned vocab items could not be matched to DB vocabulary_items rows`);
  }

  if (grammarResolution.unmatched.length > 0) {
    blockers.push(`${grammarResolution.unmatched.length} planned grammar points could not be matched to DB grammar_points rows`);
  }

  if (grammarResolution.ambiguous.length > 0) {
    blockers.push(`${grammarResolution.ambiguous.length} planned grammar points matched multiple DB rows`);
  }

  const warnings = [];

  if (vocabResolution.occurrenceResolved.length > 0) {
    warnings.push(
      `${vocabResolution.occurrenceResolved.length} vocab items needed occurrence-order resolution because their display labels repeat`
    );
  }

  if (vocabResolution.ambiguous.length > 0) {
    warnings.push(
      `${vocabResolution.ambiguous.length} vocab display-label groups have unused same-label DB candidates after matching`
    );
  }

  return {
    source: manifest.source,
    database: {
      courseSlug: COURSE_SLUG,
      loaded: {
        courses: db.courses.length,
        courseVariants: db.courseVariants.length,
        modules: db.modules.length,
        lessons: db.lessons.length,
        vocabularySets: db.vocabularySets.length,
        vocabularyLists: db.vocabularyLists.length,
        vocabularyItems: db.vocabularyItems.length,
        grammarSets: db.grammarSets.length,
        grammarPoints: db.grammarPoints.length,
      },
    },
    manifestSummary: manifest.summary,
    existingStructure,
    vocabResolution: {
      planned: vocabResolution.planned,
      matched: vocabResolution.matched,
      unmatched: vocabResolution.unmatched,
      ambiguous: vocabResolution.ambiguous,
      occurrenceResolvedCount: vocabResolution.occurrenceResolved.length,
      occurrenceResolvedSample: vocabResolution.occurrenceResolved.slice(0, 25),
      matches: vocabResolution.matches,
    },
    grammarResolution: {
      planned: grammarResolution.planned,
      matched: grammarResolution.matched,
      unmatched: grammarResolution.unmatched,
      ambiguous: grammarResolution.ambiguous,
      matches: grammarResolution.matches,
    },
    blockers,
    warnings,
    readyForWriteDryRun: blockers.length === 0,
  };
}

function writeJson(outPath, data) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function printSummary(report, outPath) {
  console.log("Course-map DB dry run");
  console.log("=====================");
  console.log(`Course: ${report.database.courseSlug}`);
  console.log("");
  console.log("Loaded from DB:");
  console.log(`- Vocabulary items: ${report.database.loaded.vocabularyItems}`);
  console.log(`- Grammar points: ${report.database.loaded.grammarPoints}`);
  console.log(`- Existing modules: ${report.database.loaded.modules}`);
  console.log(`- Existing lessons: ${report.database.loaded.lessons}`);
  console.log("");
  console.log("DB resolution:");
  console.log(`- Vocab matched: ${report.vocabResolution.matched} / ${report.vocabResolution.planned}`);
  console.log(`- Vocab unmatched: ${report.vocabResolution.unmatched.length}`);
  console.log(`- Vocab occurrence-order resolutions: ${report.vocabResolution.occurrenceResolvedCount}`);
  console.log(`- Grammar matched: ${report.grammarResolution.matched} / ${report.grammarResolution.planned}`);
  console.log(`- Grammar unmatched: ${report.grammarResolution.unmatched.length}`);
  console.log("");
  console.log("Would create, before existing-row reuse:");
  console.log(`- Conflicting existing modules to archive first: ${report.existingStructure.positionConflicts.modules}`);
  console.log(`- Modules: ${report.existingStructure.wouldCreate.modules}`);
  console.log(`- Lessons: ${report.existingStructure.wouldCreate.lessons}`);
  console.log(`- Vocabulary sets: ${report.existingStructure.wouldCreate.vocabularySets}`);
  console.log(`- Vocabulary lists: ${report.existingStructure.wouldCreate.vocabularyLists}`);
  console.log(`- Vocabulary list items: ${report.existingStructure.wouldCreate.vocabularyListItems}`);
  console.log(`- Lesson vocabulary set usages: ${report.existingStructure.wouldCreate.lessonVocabularySetUsages}`);
  console.log(`- Lesson vocabulary list links: ${report.existingStructure.wouldCreate.lessonVocabularyListLinks}`);
  console.log(`- Lesson grammar links: ${report.existingStructure.wouldCreate.lessonGrammarLinks}`);
  console.log("");
  console.log(`Ready for write dry-run: ${report.readyForWriteDryRun ? "yes" : "no"}`);

  if (report.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of report.warnings) {
      console.log(`- ${warning}`);
    }
  }

  if (report.blockers.length > 0) {
    console.log("");
    console.log("Blockers:");
    for (const blocker of report.blockers) {
      console.log(`- ${blocker}`);
    }
  }

  console.log("");
  console.log(`Wrote report: ${path.relative(ROOT, outPath)}`);
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
  const manifest = buildMarkdownManifest();
  const db = await loadDatabaseSnapshot(supabase);
  const report = buildReport(manifest, db);

  writeJson(args.outPath, report);

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else if (args.summary) {
    printSummary(report, args.outPath);
  }

  if (!report.readyForWriteDryRun) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

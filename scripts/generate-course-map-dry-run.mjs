import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DEFAULT_DOC_PATH = path.join(ROOT, "docs", "gcse-russian-course-map.md");
const SOURCE_KEY = "gcse-russian-course-map";
const FOUNDATION = "foundation";
const HIGHER = "higher";
const SHARED = "Shared";
const HIGHER_EXTENSION = "Higher extension";

const THEME_KEYS = new Map([
  [5, "theme_1_identity_culture"],
  [6, "theme_2_local_area_holiday_travel"],
  [7, "theme_3_school"],
  [8, "theme_4_future_work"],
  [9, "theme_5_global_international"],
]);

const MODULE_DESCRIPTIONS = new Map([
  [1, "Introductory lessons that explain the platform, course route, tiers and GCSE exam shape."],
  [2, "Beginner-friendly Russian basics for students who need Cyrillic, sound and first sentence support."],
  [3, "Reusable sentence foundations before heavier theme content begins."],
  [4, "Everyday language, descriptions and high-frequency words that bridge into the themed modules."],
  [5, "Theme 1 content for identity, daily life, culture, family, food, clothing, media and relationships."],
  [6, "Theme 2 content for local area, holidays, countries, tourist transactions, weather and travel problems."],
  [7, "Theme 3 content for school subjects, routines, rules, exams, activities and school experiences."],
  [8, "Theme 4 content for languages, ambitions, study choices, work, applications and future plans."],
  [9, "Theme 5 content for global issues, international cooperation, charities, campaigns and the environment."],
  [10, "Exam preparation lessons that recycle taught content through GCSE task types and strategy work."],
]);

function parseArgs(argv) {
  const args = {
    docPath: DEFAULT_DOC_PATH,
    outPath: null,
    json: false,
    summary: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--doc") {
      args.docPath = path.resolve(ROOT, requireValue(argv, index, arg));
      index += 1;
    } else if (arg === "--out") {
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
  console.log(`Usage: node scripts/generate-course-map-dry-run.mjs [options]

Options:
  --doc <path>      Course map markdown path. Defaults to docs/gcse-russian-course-map.md
  --out <path>      Write the generated dry-run manifest to JSON
  --json            Print the full manifest as JSON
  --summary         Print a compact summary. This is the default
`);
}

function readCourseMap(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Course map not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

function splitMarkdownRow(row) {
  const trimmed = row.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return [];

  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function stripFormatting(value) {
  return value.replace(/`/g, "").trim();
}

function parseCount(value) {
  if (!value || value === "-") return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function splitListCell(value) {
  if (!value || value === "-") return [];
  return value
    .split("<br>")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLessonKey(lessonNumber) {
  const [moduleNumber, lessonIndex] = lessonNumber.split(".").map(Number);
  return {
    moduleNumber,
    lessonIndex,
    mapKey: `m${pad2(moduleNumber)}-l${pad2(lessonIndex)}`,
  };
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function parseGrammarCellItem(value) {
  const match = value.match(/^(.*)\s+\((foundation|higher|both)\)$/i);

  if (!match) {
    return {
      grammarPoint: value,
      tier: null,
    };
  }

  return {
    grammarPoint: match[1].trim(),
    tier: match[2].toLowerCase(),
  };
}

function parseLessonTables(markdown) {
  const lessonTables = getSection(markdown, "## Lesson tables", "## Appendix A:");
  const lines = lessonTables.split(/\r?\n/);
  const modules = new Map();
  const lessons = [];
  let currentModule = null;

  for (const line of lines) {
    const moduleMatch = line.match(/^### Module (\d+):\s*(.+)$/);
    if (moduleMatch) {
      currentModule = {
        number: Number.parseInt(moduleMatch[1], 10),
        title: moduleMatch[2].trim(),
      };
      modules.set(currentModule.number, currentModule);
      continue;
    }

    if (!line.startsWith("| ")) continue;

    const cells = splitMarkdownRow(line);
    if (cells.length !== 11 || cells[0] === "Lesson" || cells[0].startsWith("---")) {
      continue;
    }

    const [lessonNumber, pathName, specTopicKey, title, purpose, core, secondary, grammar, sourceCategories, higherDelivery, buildNotes] =
      cells;
    const lessonKey = getLessonKey(lessonNumber);
    const grammarIntroduced = splitListCell(grammar).map(parseGrammarCellItem);

    lessons.push({
      lessonNumber,
      moduleNumber: lessonKey.moduleNumber,
      lessonIndex: lessonKey.lessonIndex,
      mapKey: lessonKey.mapKey,
      path: pathName,
      specTopicKey: specTopicKey === "-" ? null : specTopicKey,
      title,
      purpose,
      coreVocabCount: parseCount(core),
      secondaryVocabCount: parseCount(secondary),
      grammarIntroduced,
      sourceCategories: sourceCategories === "-" ? null : sourceCategories,
      higherDelivery: higherDelivery === "-" ? null : higherDelivery,
      buildNotes,
      moduleTitle: currentModule?.title ?? `Module ${lessonKey.moduleNumber}`,
    });
  }

  return {
    modules: [...modules.values()].sort((a, b) => a.number - b.number),
    lessons,
  };
}

function getSection(markdown, startHeading, endHeading) {
  const startIndex = markdown.indexOf(startHeading);
  if (startIndex === -1) {
    throw new Error(`Could not find section: ${startHeading}`);
  }

  const endIndex = endHeading ? markdown.indexOf(endHeading, startIndex + startHeading.length) : -1;
  return endIndex === -1 ? markdown.slice(startIndex) : markdown.slice(startIndex, endIndex);
}

function parseAppendixA(markdown) {
  const appendix = getSection(markdown, "## Appendix A: Exact vocab by lesson", "## Appendix B:");
  const blocks = appendix.split(/\r?\n(?=### Lesson )/);
  const appendixByLesson = new Map();

  for (const block of blocks) {
    const headingMatch = block.match(/^### Lesson ([0-9]+\.[0-9]+):\s*(.+)$/m);
    if (!headingMatch) continue;

    const lessonNumber = headingMatch[1];
    const title = headingMatch[2].trim();
    const pathName = readBullet(block, "Path");
    const plannedCustomSetName = readBullet(block, "Planned custom set name");
    const sourceSets = readBullet(block, "Source sets");
    const sourceCategories = readBullet(block, "Source categories");
    const coreVocabCount = parseCount(readBullet(block, "Core vocab count"));
    const secondaryVocabCount = parseCount(readBullet(block, "Secondary vocab count"));
    const coreItems = parseVocabSection(block, "Core vocab section:");
    const secondaryItems = parseVocabSection(block, "Secondary vocab section:");

    appendixByLesson.set(lessonNumber, {
      lessonNumber,
      title,
      path: pathName,
      plannedCustomSetName,
      sourceSets,
      sourceCategories,
      coreVocabCount,
      secondaryVocabCount,
      coreItems,
      secondaryItems,
      items: [
        ...coreItems.map((item) => ({ ...item, role: "core" })),
        ...secondaryItems.map((item) => ({ ...item, role: "secondary" })),
      ],
    });
  }

  return appendixByLesson;
}

function readBullet(block, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(new RegExp(`^- ${escaped}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : null;
}

function parseVocabSection(block, sectionHeading) {
  const startIndex = block.indexOf(sectionHeading);
  if (startIndex === -1) return [];

  const afterStart = block.slice(startIndex + sectionHeading.length);
  const nextSectionIndex = afterStart.search(/\r?\n(?:Core vocab section:|Secondary vocab section:|### Lesson |## Appendix B:)/);
  const section = nextSectionIndex === -1 ? afterStart : afterStart.slice(0, nextSectionIndex);

  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map(parseVocabItemLine);
}

function parseVocabItemLine(line) {
  const numberMatch = line.match(/^(\d+)\.\s+(.+)$/);
  if (!numberMatch) {
    throw new Error(`Invalid vocab item line: ${line}`);
  }

  const position = Number.parseInt(numberMatch[1], 10);
  const raw = numberMatch[2];
  const separatorIndex = raw.indexOf(" - ");

  if (separatorIndex === -1) {
    throw new Error(`Could not split Russian/English vocab item: ${line}`);
  }

  const russian = raw.slice(0, separatorIndex).trim();
  const englishAndMeta = raw.slice(separatorIndex + 3).trim();
  const metaMatch = englishAndMeta.match(/^(.*)\s+\(([^()]*)\)$/);

  if (!metaMatch) {
    return {
      position,
      russian,
      english: englishAndMeta,
      tier: null,
      partOfSpeech: null,
      transliteration: null,
      rawMetadata: null,
    };
  }

  const english = metaMatch[1].trim();
  const metadataParts = metaMatch[2]
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  const transliterationPart = metadataParts.find((part) => part.startsWith("translit."));

  return {
    position,
    russian,
    english,
    tier: metadataParts[0] ?? null,
    partOfSpeech: metadataParts[1] ?? null,
    transliteration: transliterationPart?.replace(/^translit\.\s*/, "").trim() ?? null,
    rawMetadata: metaMatch[2],
  };
}

function parseGrammarAppendix(markdown) {
  const appendix = getSection(markdown, "## Appendix B: Grammar coverage checklist");
  const rows = [];

  for (const line of appendix.split(/\r?\n/)) {
    if (!line.startsWith("| ")) continue;

    const cells = splitMarkdownRow(line);
    if (cells.length !== 6 || cells[0] === "Grammar point" || cells[0].startsWith("---")) {
      continue;
    }

    const [grammarPoint, tier, requirement, grammarSet, firstIntroducedIn, lessonTitle] = cells;
    rows.push({
      grammarPoint: stripFormatting(grammarPoint),
      tier: stripFormatting(tier),
      requirement: stripFormatting(requirement),
      grammarSet: stripFormatting(grammarSet),
      firstIntroducedIn: stripFormatting(firstIntroducedIn),
      lessonTitle: stripFormatting(lessonTitle),
    });
  }

  return rows;
}

function buildManifest(parsed) {
  const lessonByNumber = new Map(parsed.lessons.map((lesson) => [lesson.lessonNumber, lesson]));
  const moduleRecords = buildModuleRecords(parsed.modules);
  const lessonRecords = buildLessonRecords(parsed.lessons);
  const vocab = buildVocabularyRecords(parsed, lessonByNumber);
  const grammar = buildGrammarLinks(parsed, lessonByNumber);
  const audits = buildAudits({
    parsed,
    moduleRecords,
    lessonRecords,
    vocab,
    grammar,
    lessonByNumber,
  });

  return {
    source: {
      document: path.relative(ROOT, parsed.docPath),
      sourceKey: SOURCE_KEY,
    },
    summary: audits.summary,
    modules: moduleRecords,
    lessons: lessonRecords,
    vocabularySets: vocab.vocabularySets,
    vocabularyLists: vocab.vocabularyLists,
    vocabularyListItems: vocab.vocabularyListItems,
    lessonVocabularySetUsages: vocab.lessonVocabularySetUsages,
    lessonVocabularyListLinks: vocab.lessonVocabularyListLinks,
    lessonGrammarLinks: grammar.lessonGrammarLinks,
    audits,
  };
}

function buildModuleRecords(modules) {
  return [FOUNDATION, HIGHER].flatMap((variant) =>
    modules.map((courseModule) => ({
      variant,
      slug: `m${pad2(courseModule.number)}-${slugify(courseModule.title)}`,
      title: courseModule.title,
      description: MODULE_DESCRIPTIONS.get(courseModule.number) ?? null,
      position: courseModule.number,
      is_published: false,
      source_key: SOURCE_KEY,
      import_key: `module:m${pad2(courseModule.number)}:${variant}`,
    }))
  );
}

function buildLessonRecords(lessons) {
  const positionByVariantModule = new Map();
  const records = [];

  for (const lesson of lessons) {
    const variants = lesson.path === HIGHER_EXTENSION ? [HIGHER] : [FOUNDATION, HIGHER];

    for (const variant of variants) {
      const modulePositionKey = `${variant}:${lesson.moduleNumber}`;
      const position = (positionByVariantModule.get(modulePositionKey) ?? 0) + 1;
      positionByVariantModule.set(modulePositionKey, position);

      records.push({
        variant,
        module_slug: moduleSlugForLesson(lesson),
        slug: lessonSlug(lesson),
        title: lesson.title,
        summary: lesson.purpose,
        lesson_type: lesson.moduleNumber === 10 ? "exam_prep" : "standard",
        position,
        estimated_minutes: null,
        is_published: false,
        is_trial_visible: false,
        requires_paid_access: true,
        available_in_volna: true,
        content_source: "db",
        content_key: `${SOURCE_KEY}:${lesson.mapKey}`,
        map_lesson_number: lesson.lessonNumber,
        path: lesson.path,
        spec_topic_key: lesson.specTopicKey,
        theme_key: THEME_KEYS.get(lesson.moduleNumber) ?? null,
        source_key: SOURCE_KEY,
        import_key: `lesson:${lesson.mapKey}:${variant}`,
      });
    }
  }

  return records;
}

function moduleSlugForLesson(lesson) {
  return `m${pad2(lesson.moduleNumber)}-${slugify(lesson.moduleTitle)}`;
}

function lessonSlug(lesson) {
  return `${lesson.mapKey}-${slugify(lesson.title)}`;
}

function customVocabSetSlug(lesson) {
  return `cv-${lessonSlug(lesson)}`;
}

function buildVocabularyRecords(parsed, lessonByNumber) {
  const vocabularySets = [];
  const vocabularyLists = [];
  const vocabularyListItems = [];
  const lessonVocabularySetUsages = [];
  const lessonVocabularyListLinks = [];
  const sourceCategoryCounts = new Map();

  for (const appendix of parsed.appendixA.values()) {
    const lesson = lessonByNumber.get(appendix.lessonNumber);
    if (!lesson) continue;

    const setSlug = customVocabSetSlug(lesson);
    const lessonVariants = lesson.path === HIGHER_EXTENSION ? [HIGHER] : [FOUNDATION, HIGHER];
    const sourceCategoryByItem = getSourceCategoryByItemKey(
      appendix,
      sourceCategoryCounts
    );

    vocabularySets.push({
      slug: setSlug,
      title: `Custom Vocab Set: ${lesson.title}`,
      description: `Lesson-sized first-teaching vocabulary for ${lesson.lessonNumber}: ${lesson.title}.`,
      theme_key: THEME_KEYS.get(lesson.moduleNumber) ?? null,
      topic_key: lesson.specTopicKey,
      tier: lesson.path === HIGHER_EXTENSION ? "higher" : "both",
      list_mode: "custom",
      set_type: "lesson_custom",
      default_display_variant: "two_column",
      is_published: false,
      sort_order: lesson.moduleNumber * 1000 + lesson.lessonIndex,
      source_key: SOURCE_KEY,
      import_key: `vocab:${lesson.mapKey}`,
      planned_custom_set_name: appendix.plannedCustomSetName,
      source_categories: appendix.sourceCategories,
    });

    const lists = [
      {
        role: "core",
        slug: "core",
        title: `${lesson.title}: core vocab`,
        items: appendix.coreItems,
        sort_order: 1,
      },
      ...(appendix.secondaryItems.length > 0
        ? [
            {
              role: "secondary",
              slug: "secondary",
              title: `${lesson.title}: secondary vocab`,
              items: appendix.secondaryItems,
              sort_order: 2,
            },
          ]
        : []),
    ];

    for (const list of lists) {
      vocabularyLists.push({
        vocabulary_set_slug: setSlug,
        slug: list.slug,
        title: list.title,
        description:
          list.role === "core"
            ? "Main first-teaching vocabulary for the lesson."
            : "Secondary or recognition-focused first-teaching vocabulary for the lesson.",
        theme_key: THEME_KEYS.get(lesson.moduleNumber) ?? null,
        topic_key: lesson.specTopicKey,
        tier: lesson.path === HIGHER_EXTENSION ? "higher" : "both",
        list_mode: "custom",
        default_display_variant: "two_column",
        is_published: false,
        sort_order: list.sort_order,
        source_key: SOURCE_KEY,
        import_key: `vocab-list:${lesson.mapKey}:${list.slug}`,
      });

      for (const [index, item] of list.items.entries()) {
        vocabularyListItems.push({
        vocabulary_set_slug: setSlug,
        vocabulary_list_slug: list.slug,
        position: index + 1,
        role: list.role,
          russian: item.russian,
          english: item.english,
          tier: item.tier,
          part_of_speech: item.partOfSpeech,
          transliteration: item.transliteration,
          source_lookup: {
            russian: item.russian,
            english: item.english,
          },
          source_category:
            sourceCategoryByItem.get(`${list.role}:${item.position}`)?.label ?? null,
          source_category_item_index:
            sourceCategoryByItem.get(`${list.role}:${item.position}`)?.sourceIndex ?? null,
          source_categories: appendix.sourceCategories,
          source_key: SOURCE_KEY,
          import_key: `vocab-item:${lesson.mapKey}:${list.slug}:${index + 1}`,
      });
      }
    }

    for (const variant of lessonVariants) {
      lessonVocabularySetUsages.push({
        variant,
        lesson_import_key: `lesson:${lesson.mapKey}:${variant}`,
        vocabulary_set_slug: setSlug,
        usage_type: "lesson_page",
        source_key: SOURCE_KEY,
        import_key: `lesson-vocab-set:${lesson.mapKey}:${variant}`,
      });

      for (const list of lists) {
        lessonVocabularyListLinks.push({
          variant,
          lesson_import_key: `lesson:${lesson.mapKey}:${variant}`,
          vocabulary_set_slug: setSlug,
          vocabulary_list_slug: list.slug,
          link_type: "list",
          usage_type: "lesson_page",
          position: list.sort_order,
          source_key: SOURCE_KEY,
          import_key: `lesson-vocab-list:${lesson.mapKey}:${variant}:${list.slug}`,
        });
      }
    }
  }

  return {
    vocabularySets,
    vocabularyLists,
    vocabularyListItems,
    lessonVocabularySetUsages,
    lessonVocabularyListLinks,
  };
}

function getSourceCategoryByItemKey(appendix, sourceCategoryCounts) {
  const categoryCounts = parseSourceCategoryCounts(appendix.sourceCategories);
  const sourceCategoryByItem = new Map();

  if (categoryCounts.length === 0) {
    return sourceCategoryByItem;
  }

  const items = [
    ...appendix.coreItems.map((item) => ({ role: "core", item })),
    ...appendix.secondaryItems.map((item) => ({ role: "secondary", item })),
  ];
  let itemIndex = 0;

  for (const category of categoryCounts) {
    for (let count = 0; count < category.count && itemIndex < items.length; count += 1) {
      const entry = items[itemIndex];
      const currentCount = sourceCategoryCounts.get(category.label) ?? 0;
      const sourceIndex = currentCount + 1;
      sourceCategoryCounts.set(category.label, sourceIndex);
      sourceCategoryByItem.set(`${entry.role}:${entry.item.position}`, {
        ...category,
        sourceIndex,
      });
      itemIndex += 1;
    }
  }

  return sourceCategoryByItem;
}

function parseSourceCategoryCounts(sourceCategories) {
  if (!sourceCategories) return [];

  return sourceCategories
    .split(";")
    .map((category) => {
      const match = category.trim().match(/^(.+)\s+\((\d+)\)$/);
      if (!match) return null;

      return {
        label: match[1].trim(),
        count: Number.parseInt(match[2], 10),
      };
    })
    .filter((category) => category && Number.isFinite(category.count));
}

function buildGrammarLinks(parsed, lessonByNumber) {
  const lessonGrammarLinks = [];

  for (const [index, row] of parsed.grammarRows.entries()) {
    const lesson = lessonByNumber.get(row.firstIntroducedIn);
    if (!lesson) continue;

    const variants = lesson.path === HIGHER_EXTENSION ? [HIGHER] : [FOUNDATION, HIGHER];

    for (const variant of variants) {
      lessonGrammarLinks.push({
        variant,
        lesson_import_key: `lesson:${lesson.mapKey}:${variant}`,
        grammar_point: row.grammarPoint,
        grammar_set: row.grammarSet,
        grammar_tier: row.tier,
        requirement: row.requirement,
        link_type: "point",
        usage_type: "lesson_page",
        position: index + 1,
        source_key: SOURCE_KEY,
        import_key: `lesson-grammar:${lesson.mapKey}:${variant}:${slugify(row.grammarSet)}:${slugify(row.grammarPoint)}`,
      });
    }
  }

  return { lessonGrammarLinks };
}

function buildAudits({ parsed, moduleRecords, lessonRecords, vocab, grammar, lessonByNumber }) {
  const expectedVocabLessonNumbers = new Set(
    parsed.lessons
      .filter((lesson) => lesson.coreVocabCount + lesson.secondaryVocabCount > 0)
      .map((lesson) => lesson.lessonNumber)
  );
  const appendixLessonNumbers = new Set(parsed.appendixA.keys());
  const missingAppendices = [...expectedVocabLessonNumbers].filter(
    (lessonNumber) => !appendixLessonNumbers.has(lessonNumber)
  );
  const extraAppendices = [...appendixLessonNumbers].filter(
    (lessonNumber) => !expectedVocabLessonNumbers.has(lessonNumber)
  );
  const appendixCountMismatches = [];

  for (const appendix of parsed.appendixA.values()) {
    const lesson = lessonByNumber.get(appendix.lessonNumber);
    if (!lesson) continue;

    if (
      appendix.coreItems.length !== lesson.coreVocabCount ||
      appendix.secondaryItems.length !== lesson.secondaryVocabCount ||
      appendix.coreItems.length !== appendix.coreVocabCount ||
      appendix.secondaryItems.length !== appendix.secondaryVocabCount
    ) {
      appendixCountMismatches.push({
        lesson: appendix.lessonNumber,
        title: appendix.title,
        tableCore: lesson.coreVocabCount,
        appendixCoreCount: appendix.coreVocabCount,
        parsedCoreItems: appendix.coreItems.length,
        tableSecondary: lesson.secondaryVocabCount,
        appendixSecondaryCount: appendix.secondaryVocabCount,
        parsedSecondaryItems: appendix.secondaryItems.length,
      });
    }
  }

  const possibleDuplicateVocabLabels = getDuplicates(
    vocab.vocabularyListItems.map(
      (item) => `${item.russian.trim().toLowerCase()}||${item.english.trim().toLowerCase()}`
    )
  );
  const duplicateVocabImportKeys = getDuplicates(
    vocab.vocabularyListItems.map((item) => item.import_key)
  );
  const duplicateVocabSetSlugs = getDuplicates(vocab.vocabularySets.map((set) => set.slug));
  const duplicateVocabListKeys = getDuplicates(
    vocab.vocabularyLists.map((list) => `${list.vocabulary_set_slug}:${list.slug}`)
  );
  const duplicateLessonImportKeys = getDuplicates(
    lessonRecords.map((lesson) => lesson.import_key)
  );
  const duplicateModuleImportKeys = getDuplicates(
    moduleRecords.map((courseModule) => courseModule.import_key)
  );
  const grammarKeys = parsed.grammarRows.map(
    (row) => `${row.grammarSet}||${row.grammarPoint}||${row.tier}`.toLowerCase()
  );
  const duplicateGrammarKeys = getDuplicates(grammarKeys);

  const lessonTableGrammar = new Map();
  for (const lesson of parsed.lessons) {
    for (const grammarItem of lesson.grammarIntroduced) {
      lessonTableGrammar.set(
        `${lesson.lessonNumber}||${grammarItem.grammarPoint}`.toLowerCase(),
        true
      );
    }
  }

  const grammarRowsMissingFromLessonTable = parsed.grammarRows.filter(
    (row) =>
      !lessonTableGrammar.has(`${row.firstIntroducedIn}||${row.grammarPoint}`.toLowerCase())
  );

  const lessonCountsByVariant = countBy(lessonRecords, (record) => record.variant);
  const lessonCountsByPath = countBy(parsed.lessons, (lesson) => lesson.path);
  const vocabularyItemsTotal = vocab.vocabularyListItems.length;
  const grammarPointsTotal = parsed.grammarRows.length;
  const moduleCountsByVariant = countBy(moduleRecords, (record) => record.variant);
  const higherExtensionLessonCount = lessonCountsByPath[HIGHER_EXTENSION] ?? 0;
  const sharedLessonCount = lessonCountsByPath[SHARED] ?? 0;

  const errors = [
    ...missingAppendices.map((lesson) => `Missing Appendix A vocab list for lesson ${lesson}`),
    ...extraAppendices.map((lesson) => `Extra Appendix A vocab list for lesson ${lesson}`),
    ...appendixCountMismatches.map((mismatch) => `Vocab count mismatch in lesson ${mismatch.lesson}`),
    ...duplicateVocabImportKeys.map((key) => `Duplicate vocab list item import key: ${key}`),
    ...duplicateVocabSetSlugs.map((slug) => `Duplicate vocab set slug: ${slug}`),
    ...duplicateVocabListKeys.map((key) => `Duplicate vocab list key: ${key}`),
    ...duplicateLessonImportKeys.map((key) => `Duplicate lesson import key: ${key}`),
    ...duplicateModuleImportKeys.map((key) => `Duplicate module import key: ${key}`),
    ...duplicateGrammarKeys.map((key) => `Duplicate first-introduction grammar key: ${key}`),
    ...grammarRowsMissingFromLessonTable.map(
      (row) => `Grammar appendix row missing from lesson table: ${row.firstIntroducedIn} ${row.grammarPoint}`
    ),
  ];

  const summary = {
    modulesPerVariant: moduleCountsByVariant,
    lessonRowsInMap: parsed.lessons.length,
    sharedLessonRows: sharedLessonCount,
    higherExtensionLessonRows: higherExtensionLessonCount,
    generatedLessonRecords: lessonRecords.length,
    generatedFoundationLessons: lessonCountsByVariant[FOUNDATION] ?? 0,
    generatedHigherLessons: lessonCountsByVariant[HIGHER] ?? 0,
    vocabularySets: vocab.vocabularySets.length,
    vocabularyLists: vocab.vocabularyLists.length,
    vocabularyListItems: vocabularyItemsTotal,
    lessonVocabularySetUsages: vocab.lessonVocabularySetUsages.length,
    lessonVocabularyListLinks: vocab.lessonVocabularyListLinks.length,
    grammarPoints: grammarPointsTotal,
    lessonGrammarLinks: grammar.lessonGrammarLinks.length,
    acceptance: {
      vocabularyItemsAllocated: vocabularyItemsTotal,
      grammarPointsAllocated: grammarPointsTotal,
      leftoverVocabulary: Math.max(0, 2589 - vocabularyItemsTotal),
      leftoverGrammar: Math.max(0, 132 - grammarPointsTotal),
      duplicateFirstTeachingVocabulary: duplicateVocabImportKeys.length,
      duplicateFirstIntroductionGrammar: duplicateGrammarKeys.length,
      foundationLessons: lessonCountsByVariant[FOUNDATION] ?? 0,
      higherLessons: lessonCountsByVariant[HIGHER] ?? 0,
      passed:
        vocabularyItemsTotal === 2589 &&
        grammarPointsTotal === 132 &&
        duplicateVocabImportKeys.length === 0 &&
        duplicateGrammarKeys.length === 0 &&
        (lessonCountsByVariant[FOUNDATION] ?? 0) === 148 &&
        (lessonCountsByVariant[HIGHER] ?? 0) === 182 &&
        errors.length === 0,
    },
    warnings: {
      possibleDuplicateVocabLabels: possibleDuplicateVocabLabels.length,
    },
  };

  return {
    summary,
    missingAppendices,
    extraAppendices,
    appendixCountMismatches,
    possibleDuplicateVocabLabels,
    duplicateVocabImportKeys,
    duplicateVocabSetSlugs,
    duplicateVocabListKeys,
    duplicateLessonImportKeys,
    duplicateModuleImportKeys,
    duplicateGrammarKeys,
    grammarRowsMissingFromLessonTable,
    errors,
  };
}

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function getDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }

  return [...duplicates];
}

function printSummary(manifest) {
  const { summary } = manifest;

  console.log("Course-map dry run");
  console.log("==================");
  console.log(`Document: ${manifest.source.document}`);
  console.log("");
  console.log("Generated structure:");
  console.log(`- Modules: ${manifest.modules.length} total (${formatCounts(summary.modulesPerVariant)})`);
  console.log(
    `- Lessons: ${summary.generatedLessonRecords} records (${summary.generatedFoundationLessons} Foundation, ${summary.generatedHigherLessons} Higher)`
  );
  console.log(`- Vocab sets: ${summary.vocabularySets}`);
  console.log(`- Vocab lists: ${summary.vocabularyLists}`);
  console.log(`- Vocab list items: ${summary.vocabularyListItems}`);
  console.log(`- Lesson vocab set usages: ${summary.lessonVocabularySetUsages}`);
  console.log(`- Lesson vocab list links: ${summary.lessonVocabularyListLinks}`);
  console.log(`- Grammar points: ${summary.grammarPoints}`);
  console.log(`- Lesson grammar links: ${summary.lessonGrammarLinks}`);
  console.log("");
  console.log("Acceptance:");
  console.log(`- Vocab coverage: ${summary.acceptance.vocabularyItemsAllocated} / 2589`);
  console.log(`- Grammar coverage: ${summary.acceptance.grammarPointsAllocated} / 132`);
  console.log(`- Leftover vocab: ${summary.acceptance.leftoverVocabulary}`);
  console.log(`- Leftover grammar: ${summary.acceptance.leftoverGrammar}`);
  console.log(`- Duplicate first-teaching vocab: ${summary.acceptance.duplicateFirstTeachingVocabulary}`);
  console.log(`- Duplicate first-introduction grammar: ${summary.acceptance.duplicateFirstIntroductionGrammar}`);
  console.log(`- Foundation lessons: ${summary.acceptance.foundationLessons} / 148`);
  console.log(`- Higher lessons: ${summary.acceptance.higherLessons} / 182`);
  console.log(`- Passed: ${summary.acceptance.passed ? "yes" : "no"}`);
  console.log("");
  console.log("Warnings:");
  console.log(
    `- Possible duplicate vocab display labels needing DB-ID resolution: ${summary.warnings.possibleDuplicateVocabLabels}`
  );

  if (manifest.audits.errors.length > 0) {
    console.log("");
    console.log("Errors:");
    for (const error of manifest.audits.errors) {
      console.log(`- ${error}`);
    }
  }
}

function formatCounts(counts) {
  return Object.entries(counts)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

function writeManifest(outPath, manifest) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const markdown = readCourseMap(args.docPath);
  const lessonTableData = parseLessonTables(markdown);
  const appendixA = parseAppendixA(markdown);
  const grammarRows = parseGrammarAppendix(markdown);
  const manifest = buildManifest({
    ...lessonTableData,
    appendixA,
    grammarRows,
    docPath: args.docPath,
  });

  if (args.outPath) {
    writeManifest(args.outPath, manifest);
  }

  if (args.json) {
    console.log(JSON.stringify(manifest, null, 2));
  } else if (args.summary) {
    printSummary(manifest);
    if (args.outPath) {
      console.log("");
      console.log(`Wrote manifest: ${path.relative(ROOT, args.outPath)}`);
    }
  }

  if (!manifest.summary.acceptance.passed) {
    process.exitCode = 1;
  }
}

main();

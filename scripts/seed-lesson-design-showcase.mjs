import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");

const COURSE_SLUG = "gcse-russian";
const VARIANT_SLUG = "foundation";
const MODULE_SLUG = "introduction-to-the-course";
const LESSON_SLUG = "lesson-design-showcase";
const QUESTION_SET_SLUG = "lesson-design-showcase-practice";
const VOCABULARY_SET_SLUG = "lesson-design-showcase-vocabulary";
const VOCABULARY_LIST_SLUG = "starter-language-for-a-premium-lesson";
const GRAMMAR_SET_SLUG = "lesson-design-showcase-grammar";
const SOURCE_KEY = "lesson_design_showcase";
const SOURCE_VERSION = "v1";

const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";

function readEnvFile(filePath) {
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
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase();
}

function assertOk(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }

  return result.data;
}

async function maybeSingle(supabase, table, select, filters) {
  let query = supabase.from(table).select(select);

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`Lookup failed for ${table}: ${error.message}`);

  return data;
}

async function insertOne(supabase, table, values, label = table) {
  const { data, error } = await supabase.from(table).insert(values).select("*").single();
  if (error) throw new Error(`Insert failed for ${label}: ${error.message}`);

  return data;
}

async function insertMany(supabase, table, values, label = table) {
  if (values.length === 0) return [];

  const { data, error } = await supabase.from(table).insert(values).select("*");
  if (error) throw new Error(`Insert failed for ${label}: ${error.message}`);

  return data ?? [];
}

async function getFoundationModule(supabase) {
  const course = await maybeSingle(supabase, "courses", "id, slug, title", {
    slug: COURSE_SLUG,
  });
  if (!course) throw new Error(`Course not found: ${COURSE_SLUG}`);

  const variant = await maybeSingle(
    supabase,
    "course_variants",
    "id, slug, title, course_id",
    {
      course_id: course.id,
      slug: VARIANT_SLUG,
    }
  );
  if (!variant) throw new Error(`Variant not found: ${VARIANT_SLUG}`);

  const module = await maybeSingle(
    supabase,
    "modules",
    "id, slug, title, course_variant_id",
    {
      course_variant_id: variant.id,
      slug: MODULE_SLUG,
    }
  );
  if (!module) throw new Error(`Module not found: ${MODULE_SLUG}`);

  return { course, variant, module };
}

async function getNextLessonPosition(supabase, moduleId) {
  const { data, error } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId)
    .order("position", { ascending: false })
    .limit(1);

  if (error) throw new Error(`Could not read lesson positions: ${error.message}`);

  return ((data ?? [])[0]?.position ?? 0) + 1;
}

async function ensureQuestionSet(supabase) {
  const existing = await maybeSingle(supabase, "question_sets", "id, slug", {
    slug: QUESTION_SET_SLUG,
  });
  if (existing) return existing;

  const questionSet = await insertOne(supabase, "question_sets", {
    slug: QUESTION_SET_SLUG,
    title: "Lesson Design Showcase - Practice Set",
    description:
      "A deliberately broad question set that exercises every runtime question renderer.",
    instructions:
      "Use this set to check layout, feedback, progress, and interaction states across the lesson UI.",
    source_type: "lesson",
    is_template: false,
    template_type: null,
  });

  const questions = await insertMany(
    supabase,
    "questions",
    [
      {
        question_set_id: questionSet.id,
        question_type: "multiple_choice",
        prompt: "What does Как дела? mean?",
        explanation: "Как дела? is the everyday Russian question How are you?",
        difficulty: 1,
        marks: 1,
        metadata: { skill: "vocabulary", checkpoint: "meaning" },
        position: 1,
        is_active: true,
      },
      {
        question_set_id: questionSet.id,
        question_type: "multiple_response",
        prompt: "Choose all phrases that can start a simple introduction.",
        explanation: "Привет and Меня зовут... both work at the start of an introduction.",
        difficulty: 1,
        marks: 2,
        metadata: { skill: "speaking", checkpoint: "phrase-choice" },
        position: 2,
        is_active: true,
      },
      {
        question_set_id: questionSet.id,
        question_type: "short_answer",
        prompt: "Type the Russian for hello.",
        explanation: "Привет is the friendly everyday word for hello.",
        difficulty: 1,
        marks: 1,
        metadata: { placeholder: "Type in Russian", skill: "recall" },
        position: 3,
        is_active: true,
      },
      {
        question_set_id: questionSet.id,
        question_type: "translation",
        prompt: "Translate into Russian: I study Russian.",
        explanation: "Я учу русский means I study Russian.",
        difficulty: 2,
        marks: 2,
        metadata: {
          direction: "to_russian",
          sourceLanguageLabel: "English",
          targetLanguageLabel: "Russian",
          instruction: "Keep the subject pronoun and present-tense verb.",
          placeholder: "Type the Russian sentence",
          answerStrategy: "sentence_builder",
          wordBank: ["русский", "учу", "Я"],
          skill: "translation",
        },
        position: 4,
        is_active: true,
      },
      {
        question_set_id: questionSet.id,
        question_type: "matching",
        prompt: "Match each Russian phrase to the English meaning.",
        explanation: "These are core lesson phrases students should recognise quickly.",
        difficulty: 2,
        marks: 3,
        metadata: {
          prompts: ["Привет", "Меня зовут...", "Я учу русский"],
          options: ["My name is...", "I study Russian", "Hello"],
          correctMatches: [2, 0, 1],
          skill: "reading",
        },
        position: 5,
        is_active: true,
      },
      {
        question_set_id: questionSet.id,
        question_type: "ordering",
        prompt: "Put the words in the best order.",
        explanation: "The neutral sentence order is Я учу русский.",
        difficulty: 2,
        marks: 2,
        metadata: {
          items: ["Я", "учу", "русский"],
          correctOrder: [0, 1, 2],
          skill: "grammar",
        },
        position: 6,
        is_active: true,
      },
      {
        question_set_id: questionSet.id,
        question_type: "word_bank_gap_fill",
        prompt: "Complete the mini dialogue.",
        explanation: "The gaps practise greeting, name, and language-learning phrases.",
        difficulty: 2,
        marks: 3,
        metadata: {
          text: "__gap-1__! __gap-2__ Антон. Я __gap-3__ русский.",
          gaps: [
            { id: "gap-1", label: "Greeting", acceptedAnswers: ["Привет"] },
            { id: "gap-2", label: "Name phrase", acceptedAnswers: ["Меня зовут"] },
            { id: "gap-3", label: "Verb", acceptedAnswers: ["учу"] },
          ],
          wordBank: ["Привет", "Меня зовут", "учу", "слушаю"],
          skill: "writing",
        },
        position: 7,
        is_active: true,
      },
      {
        question_set_id: questionSet.id,
        question_type: "categorisation",
        prompt: "Sort the items into useful GCSE categories.",
        explanation:
          "This checks whether the lesson UI handles categorisation tasks clearly.",
        difficulty: 2,
        marks: 4,
        metadata: {
          categories: [
            { id: "phrase", label: "Phrase" },
            { id: "verb", label: "Verb" },
            { id: "connector", label: "Connector" },
          ],
          items: [
            { id: "item-1", text: "Меня зовут...", categoryId: "phrase" },
            { id: "item-2", text: "учить", categoryId: "verb" },
            { id: "item-3", text: "потому что", categoryId: "connector" },
            { id: "item-4", text: "слушать", categoryId: "verb" },
          ],
          skill: "metacognition",
        },
        position: 8,
        is_active: true,
      },
    ],
    "showcase questions"
  );

  const byPosition = new Map(questions.map((question) => [question.position, question]));

  await insertMany(
    supabase,
    "question_options",
    [
      ["Word", false, 1, 1],
      ["How are you?", true, 2, 1],
      ["Where do you live?", false, 3, 1],
      ["What is your name?", false, 4, 1],
      ["Привет", true, 1, 2],
      ["Меня зовут...", true, 2, 2],
      ["До свидания", false, 3, 2],
      ["Я не понимаю", false, 4, 2],
    ].map(([optionText, isCorrect, position, questionPosition]) => ({
      question_id: byPosition.get(questionPosition).id,
      option_text: optionText,
      option_rich: null,
      is_correct: isCorrect,
      match_group: null,
      position,
    })),
    "showcase question options"
  );

  await insertMany(
    supabase,
    "question_accepted_answers",
    [
      [3, "привет", true],
      [3, "Привет", false],
      [4, "Я учу русский", true],
      [4, "я учу русский", false],
    ].map(([questionPosition, answerText, isPrimary]) => ({
      question_id: byPosition.get(questionPosition).id,
      answer_text: answerText,
      normalized_answer: normalizeAnswer(answerText),
      is_primary: isPrimary,
      case_sensitive: false,
      notes: null,
    })),
    "showcase accepted answers"
  );

  return questionSet;
}

async function ensureVocabularySet(supabase) {
  const existing = await maybeSingle(supabase, "vocabulary_sets", "id, slug", {
    slug: VOCABULARY_SET_SLUG,
  });
  if (existing) {
    const existingList = await maybeSingle(
      supabase,
      "vocabulary_lists",
      "id, slug, vocabulary_set_id",
      {
        vocabulary_set_id: existing.id,
        slug: VOCABULARY_LIST_SLUG,
      }
    );

    return { vocabularySet: existing, vocabularyList: existingList };
  }

  const vocabularySet = await insertOne(supabase, "vocabulary_sets", {
    slug: VOCABULARY_SET_SLUG,
    title: "Lesson Design Showcase Vocabulary",
    description:
      "Core Russian phrases used to test vocabulary cards, linked lists, metadata, and examples.",
    theme_key: "identity_and_culture",
    topic_key: "introductions",
    tier: "foundation",
    list_mode: "custom",
    set_type: "lesson_custom",
    default_display_variant: "single_column",
    is_published: true,
    sort_order: 9000,
    source_key: SOURCE_KEY,
    source_version: SOURCE_VERSION,
    import_key: `${SOURCE_KEY}:vocabulary-set`,
  });

  const vocabularyList = await insertOne(supabase, "vocabulary_lists", {
    vocabulary_set_id: vocabularySet.id,
    slug: VOCABULARY_LIST_SLUG,
    title: "Starter Language for a Premium Lesson",
    description:
      "A focused list with words, phrases, examples, transliteration, and GCSE-style metadata.",
    theme_key: "identity_and_culture",
    topic_key: "introductions",
    category_key: "classroom_language",
    subcategory_key: "starter_phrases",
    tier: "foundation",
    list_mode: "custom",
    default_display_variant: "single_column",
    is_published: true,
    sort_order: 1,
    source_key: SOURCE_KEY,
    source_version: SOURCE_VERSION,
    source_section_ref: "Lesson design showcase vocabulary",
    import_key: `${SOURCE_KEY}:vocabulary-list`,
  });

  const vocabularyItems = await insertMany(
    supabase,
    "vocabulary_items",
    [
      {
        russian: "привет",
        english: "hello",
        transliteration: "privet",
        example_ru: "Привет! Как дела?",
        example_en: "Hello! How are you?",
        item_type: "word",
        part_of_speech: "interjection",
      },
      {
        russian: "Как дела?",
        english: "How are you?",
        transliteration: "kak dela?",
        example_ru: "Привет, как дела?",
        example_en: "Hi, how are you?",
        item_type: "phrase",
        part_of_speech: "phrase",
      },
      {
        russian: "Меня зовут...",
        english: "My name is...",
        transliteration: "menya zovut",
        example_ru: "Меня зовут Антон.",
        example_en: "My name is Anton.",
        item_type: "phrase",
        part_of_speech: "phrase",
      },
      {
        russian: "Я учу русский",
        english: "I study Russian",
        transliteration: "ya uchu russkiy",
        example_ru: "Я учу русский каждый день.",
        example_en: "I study Russian every day.",
        item_type: "phrase",
        part_of_speech: "phrase",
      },
      {
        russian: "потому что",
        english: "because",
        transliteration: "potomu chto",
        example_ru: "Я учу русский, потому что это интересно.",
        example_en: "I study Russian because it is interesting.",
        item_type: "phrase",
        part_of_speech: "conjunction",
      },
      {
        russian: "говорить",
        english: "to speak",
        transliteration: "govorit'",
        example_ru: "Я хочу говорить по-русски.",
        example_en: "I want to speak Russian.",
        item_type: "word",
        part_of_speech: "verb",
        aspect: "imperfective",
      },
      {
        russian: "слушать",
        english: "to listen",
        transliteration: "slushat'",
        example_ru: "Слушать внимательно.",
        example_en: "To listen carefully.",
        item_type: "word",
        part_of_speech: "verb",
        aspect: "imperfective",
      },
      {
        russian: "каждый день",
        english: "every day",
        transliteration: "kazhdyy den'",
        example_ru: "Я повторяю слова каждый день.",
        example_en: "I revise words every day.",
        item_type: "phrase",
        part_of_speech: "phrase",
      },
    ].map((item, index) => ({
      vocabulary_set_id: vocabularySet.id,
      russian: item.russian,
      english: item.english,
      transliteration: item.transliteration,
      example_ru: item.example_ru,
      example_en: item.example_en,
      audio_path: null,
      notes: "Showcase item for lesson UI, metadata, and examples.",
      position: index + 1,
      item_type: item.item_type,
      source_type: "custom",
      priority: index < 5 ? "core" : "extension",
      canonical_key: `${SOURCE_KEY}:vocab:${index + 1}`,
      part_of_speech: item.part_of_speech,
      gender: "not_applicable",
      plural: null,
      productive_receptive: "both",
      tier: "foundation",
      theme_key: "identity_and_culture",
      topic_key: "introductions",
      category_key: "classroom_language",
      subcategory_key: "starter_phrases",
      aspect: item.aspect ?? "not_applicable",
      case_governed: null,
      is_reflexive: false,
      source_key: SOURCE_KEY,
      source_version: SOURCE_VERSION,
      source_section_ref: "Lesson design showcase vocabulary",
      import_key: `${SOURCE_KEY}:vocab-item:${index + 1}`,
      spec_russian: item.russian,
    })),
    "showcase vocabulary items"
  );

  await insertMany(
    supabase,
    "vocabulary_list_items",
    vocabularyItems.map((item, index) => ({
      vocabulary_list_id: vocabularyList.id,
      vocabulary_item_id: item.id,
      position: index + 1,
      productive_receptive_override: "both",
      tier_override: "foundation",
      notes_override: index < 5 ? "Core phrase for first-pass learning." : null,
      source_section_ref: "Lesson design showcase vocabulary",
      import_key: `${SOURCE_KEY}:list-item:${index + 1}`,
    })),
    "showcase vocabulary list items"
  );

  return { vocabularySet, vocabularyList, vocabularyItems };
}

async function ensureGrammarSet(supabase) {
  const existing = await maybeSingle(supabase, "grammar_sets", "id, slug", {
    slug: GRAMMAR_SET_SLUG,
  });
  if (existing) {
    return { grammarSet: existing, grammarPoints: [] };
  }

  const grammarSet = await insertOne(supabase, "grammar_sets", {
    slug: GRAMMAR_SET_SLUG,
    title: "Lesson Design Showcase Grammar",
    description:
      "A compact grammar set for testing linked grammar cards, point metadata, examples, and tables.",
    theme_key: "grammar",
    topic_key: "starter_sentences",
    tier: "foundation",
    sort_order: 9000,
    is_published: true,
    is_trial_visible: true,
    requires_paid_access: false,
    available_in_volna: true,
    source_key: SOURCE_KEY,
    source_version: SOURCE_VERSION,
    import_key: `${SOURCE_KEY}:grammar-set`,
  });

  const grammarPoints = await insertMany(
    supabase,
    "grammar_points",
    [
      {
        slug: "using-ya-plus-present-tense",
        title: "Using Я + present tense",
        short_description:
          "Build a simple first-person sentence: Я учу русский.",
        full_explanation:
          "Russian often uses a clear subject plus a present-tense verb. In this lesson, Я учу русский gives students a safe model for writing and speaking.",
        spec_reference: "GCSE starter sentence control",
        grammar_tag_key: "present-tense",
        category_key: "verbs",
        knowledge_requirement: "productive",
        receptive_scope: null,
      },
      {
        slug: "because-for-simple-opinions",
        title: "Using потому что for reasons",
        short_description:
          "Join an opinion to a reason with потому что.",
        full_explanation:
          "Потому что helps students extend answers beyond one short sentence. It is useful for speaking, writing, and exam-style justification.",
        spec_reference: "Connectives and justified opinions",
        grammar_tag_key: "connectives",
        category_key: "sentence-building",
        knowledge_requirement: "mixed",
        receptive_scope: null,
      },
      {
        slug: "recognising-question-phrases",
        title: "Recognising question phrases",
        short_description:
          "Notice short question phrases such as Как дела?",
        full_explanation:
          "Short question phrases are useful for dialogue, role play, and listening practice. Students should recognise the whole phrase as a chunk.",
        spec_reference: "Common classroom and conversational phrases",
        grammar_tag_key: "questions",
        category_key: "phrases",
        knowledge_requirement: "receptive",
        receptive_scope: "Recognise the phrase and answer with a short response.",
      },
    ].map((point, index) => ({
      grammar_set_id: grammarSet.id,
      ...point,
      tier: "foundation",
      sort_order: (index + 1) * 10,
      is_published: true,
      source_key: SOURCE_KEY,
      source_version: SOURCE_VERSION,
      import_key: `${SOURCE_KEY}:grammar-point:${index + 1}`,
    })),
    "showcase grammar points"
  );

  await insertMany(
    supabase,
    "grammar_examples",
    [
      [0, "Я учу русский.", "I study Russian.", "учу", "First-person present tense."],
      [
        1,
        "Я учу русский, потому что это интересно.",
        "I study Russian because it is interesting.",
        "потому что",
        "A simple reason extends the sentence.",
      ],
      [2, "Как дела?", "How are you?", "Как", "Treat the question as a useful phrase."],
    ].map(([pointIndex, russian_text, english_translation, optional_highlight, note]) => ({
      grammar_point_id: grammarPoints[pointIndex].id,
      russian_text,
      english_translation,
      optional_highlight,
      note,
      sort_order: 1,
    })),
    "showcase grammar examples"
  );

  await insertMany(
    supabase,
    "grammar_tables",
    [
      {
        grammar_point_id: grammarPoints[0].id,
        title: "Starter sentence pattern",
        columns: ["Part", "Russian", "English"],
        rows: [
          ["Subject", "Я", "I"],
          ["Verb", "учу", "study"],
          ["Object", "русский", "Russian"],
        ],
        optional_note:
          "This table is intentionally compact so future grammar table styling can be tested inside lesson pages.",
        sort_order: 1,
      },
    ],
    "showcase grammar tables"
  );

  return { grammarSet, grammarPoints };
}

function createSections() {
  return [
    {
      title: "Start Here",
      description:
        "A warm opener that shows how a lesson can frame aims, confidence, and flow.",
      section_kind: "intro",
      canonical_section_key: "showcase-start-here",
      blocks: [
        {
          block_type: "header",
          data: { content: "Welcome to the lesson design showcase" },
        },
        {
          block_type: "text",
          data: {
            content:
              "This lesson is a live reference page for how GCSE Russian lessons should feel: clear enough for a Year 7 learner, structured enough for exam preparation, and polished enough to guide future UI decisions.",
          },
        },
        {
          block_type: "callout",
          data: {
            title: "What this page is testing",
            content:
              "Mission panels, prose blocks, callouts, notes, media, vocabulary, grammar, inline checks, full question sets, progress, completion, and responsive lesson navigation.",
          },
        },
        {
          block_type: "image",
          data: {
            src: "/illustrations/course-pathway-specific-v2.png",
            alt: "Illustration of GCSE Russian course pathway cards",
            caption: "Course pathway visual used as a real lesson media block",
          },
        },
      ],
    },
    {
      title: "Learning Goal",
      description:
        "A content section with prose, hierarchy, reminders, and a divider.",
      section_kind: "content",
      canonical_section_key: "showcase-learning-goal",
      blocks: [
        { block_type: "subheader", data: { content: "By the end, you can..." } },
        {
          block_type: "text",
          data: {
            content:
              "Use a few starter phrases to introduce yourself, recognise a short question, and build one simple Russian sentence from a model.",
          },
        },
        {
          block_type: "note",
          data: {
            title: "For students",
            content:
              "You do not need to memorise everything at once. Read the example, try the check, then come back to the vocabulary list if a word feels wobbly.",
          },
        },
        { block_type: "divider", data: {} },
        {
          block_type: "exam-tip",
          data: {
            title: "Why this matters for GCSE",
            content:
              "Small accurate sentences are the foundation of stronger speaking and writing answers. Accuracy first, then detail.",
          },
        },
      ],
    },
    {
      title: "Vocabulary Focus",
      description:
        "Inline vocabulary plus a linked vocabulary set/list with metadata.",
      section_kind: "content",
      canonical_section_key: "showcase-vocabulary-focus",
      blocks: [
        {
          block_type: "vocabulary",
          data: {
            title: "Tiny phrase bank",
            items: [
              { russian: "Привет", english: "Hello" },
              { russian: "Меня зовут...", english: "My name is..." },
              { russian: "Я учу русский", english: "I study Russian" },
            ],
          },
        },
        {
          block_type: "vocabulary-set",
          data: {
            title: "Linked vocabulary set with examples",
            vocabularySetSlug: VOCABULARY_SET_SLUG,
            vocabularyListSlug: VOCABULARY_LIST_SLUG,
          },
        },
      ],
    },
    {
      title: "Grammar Focus",
      description:
        "Linked grammar content with productive, receptive, and mixed requirements.",
      section_kind: "grammar",
      canonical_section_key: "showcase-grammar-focus",
      blocks: [
        {
          block_type: "grammar-set",
          data: {
            title: "Grammar cards for starter sentences",
            grammarSetSlug: GRAMMAR_SET_SLUG,
          },
        },
        {
          block_type: "callout",
          data: {
            title: "Sentence model",
            content:
              "Я учу русский, потому что это интересно. = I study Russian because it is interesting.",
          },
        },
      ],
    },
    {
      title: "Reading and Noticing",
      description:
        "A reading-practice section that checks text rhythm and support blocks.",
      section_kind: "reading_practice",
      canonical_section_key: "showcase-reading",
      blocks: [
        {
          block_type: "text",
          data: {
            content:
              "Привет! Меня зовут Антон. Я учу русский каждый день, потому что это интересно.",
          },
        },
        {
          block_type: "note",
          data: {
            title: "What to notice",
            content:
              "Look for the name phrase, the verb учу, and the reason phrase потому что.",
          },
        },
      ],
    },
    {
      title: "Listening and Media",
      description:
        "A media section for audio styling, captions, and playback controls.",
      section_kind: "listening_practice",
      canonical_section_key: "showcase-listening-media",
      blocks: [
        {
          block_type: "audio",
          data: {
            title: "Audio player placeholder",
            src: SILENT_WAV_DATA_URI,
            caption:
              "Silent sample audio so the lesson audio UI can be styled without a missing media file.",
            autoPlay: false,
          },
        },
        {
          block_type: "callout",
          data: {
            title: "Future behaviour to test",
            content:
              "This block should later support real listening audio, play limits, transcript reveal, and exam-style instructions.",
          },
        },
      ],
    },
    {
      title: "Speaking Practice",
      description:
        "A productive speaking section that demonstrates warm coaching before checks.",
      section_kind: "speaking_practice",
      canonical_section_key: "showcase-speaking-writing",
      blocks: [
        {
          block_type: "text",
          data: {
            content:
              "Say the model sentence aloud first: Я учу русский. Then adapt it: Я учу русский каждый день.",
          },
        },
        {
          block_type: "exam-tip",
          data: {
            title: "Speaking exam habit",
            content:
              "A short correct sentence is better than a long sentence that collapses. Add one detail only when the core sentence is secure.",
          },
        },
        {
          block_type: "short-answer",
          data: {
            question: "Type the Russian for: I study Russian.",
            acceptedAnswers: ["Я учу русский", "я учу русский"],
            explanation: "Use Я for I, учу for I study, and русский for Russian.",
            placeholder: "Я ...",
          },
        },
      ],
    },
    {
      title: "Writing Practice",
      description:
        "A dedicated writing-practice section for sentence building, accuracy, and feedback.",
      section_kind: "writing_practice",
      canonical_section_key: "showcase-writing-practice",
      blocks: [
        {
          block_type: "subheader",
          data: { content: "Write one accurate sentence first" },
        },
        {
          block_type: "text",
          data: {
            content:
              "Use the model sentence, then extend it carefully: \u042f \u0443\u0447\u0443 \u0440\u0443\u0441\u0441\u043a\u0438\u0439, \u043f\u043e\u0442\u043e\u043c\u0443 \u0447\u0442\u043e \u044d\u0442\u043e \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e.",
          },
        },
        {
          block_type: "note",
          data: {
            title: "Writing target",
            content:
              "Aim for a short sentence with a clear subject, verb, and reason. Accuracy matters more than length at this stage.",
          },
        },
        {
          block_type: "exam-tip",
          data: {
            title: "Writing exam habit",
            content:
              "Check the core sentence before adding extra detail. One correct reason phrase is more useful than three rushed clauses.",
          },
        },
        {
          block_type: "short-answer",
          data: {
            question: "Write in Russian: I study Russian because it is interesting.",
            acceptedAnswers: [
              "\u042f \u0443\u0447\u0443 \u0440\u0443\u0441\u0441\u043a\u0438\u0439, \u043f\u043e\u0442\u043e\u043c\u0443 \u0447\u0442\u043e \u044d\u0442\u043e \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e.",
              "\u044f \u0443\u0447\u0443 \u0440\u0443\u0441\u0441\u043a\u0438\u0439, \u043f\u043e\u0442\u043e\u043c\u0443 \u0447\u0442\u043e \u044d\u0442\u043e \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e",
            ],
            explanation:
              "Build the answer from the known model: \u042f \u0443\u0447\u0443 \u0440\u0443\u0441\u0441\u043a\u0438\u0439 + \u043f\u043e\u0442\u043e\u043c\u0443 \u0447\u0442\u043e + \u044d\u0442\u043e \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e.",
            placeholder: "\u042f ...",
          },
        },
      ],
    },
    {
      title: "Quick Checks",
      description:
        "Inline question blocks for immediate lightweight practice.",
      section_kind: "practice",
      canonical_section_key: "showcase-quick-checks",
      blocks: [
        {
          block_type: "multiple-choice",
          data: {
            question: "Which phrase means My name is...?",
            options: [
              { id: "a", text: "Как дела?" },
              { id: "b", text: "Меня зовут..." },
              { id: "c", text: "Потому что" },
            ],
            correctOptionId: "b",
            explanation: "Меня зовут... is the phrase for My name is...",
          },
        },
        {
          block_type: "question-set",
          data: {
            title: "Full renderer practice set",
            questionSetSlug: QUESTION_SET_SLUG,
          },
        },
      ],
    },
    {
      title: "Recap and Next Step",
      description:
        "A summary section for completion styling and final learner confidence.",
      section_kind: "summary",
      canonical_section_key: "showcase-recap",
      blocks: [
        {
          block_type: "header",
          data: { content: "You have tested the full lesson system" },
        },
        {
          block_type: "text",
          data: {
            content:
              "This page now acts as a living lesson design lab. When lesson components improve, this is the page to revisit first.",
          },
        },
        {
          block_type: "note",
          data: {
            title: "Design target",
            content:
              "Warm, modern, GCSE-focused, easy to follow, and calm enough for repeated study.",
          },
        },
      ],
    },
  ];
}

async function shiftLessonSectionsFromPosition(supabase, lessonId, fromPosition) {
  const { data, error } = await supabase
    .from("lesson_sections")
    .select("id, position")
    .eq("lesson_id", lessonId)
    .gte("position", fromPosition)
    .order("position", { ascending: false });

  if (error) {
    throw new Error(`Could not read lesson sections for shifting: ${error.message}`);
  }

  for (const section of data ?? []) {
    const { error: updateError } = await supabase
      .from("lesson_sections")
      .update({ position: section.position + 1 })
      .eq("id", section.id);

    if (updateError) {
      throw new Error(`Could not shift lesson section: ${updateError.message}`);
    }
  }
}

async function insertShowcaseSection(supabase, lessonId, section, position) {
  const insertedSection = await insertOne(supabase, "lesson_sections", {
    lesson_id: lessonId,
    title: section.title,
    description: section.description,
    section_kind: section.section_kind,
    position,
    is_published: true,
    settings: {
      showcase: true,
      designPurpose: "lesson-ui-lab",
      blockCount: section.blocks.length,
    },
    variant_visibility: "shared",
    canonical_section_key: section.canonical_section_key,
  });

  const blocks = await insertMany(
    supabase,
    "lesson_blocks",
    section.blocks.map((block, blockIndex) => ({
      lesson_section_id: insertedSection.id,
      block_type: block.block_type,
      position: blockIndex + 1,
      data: block.data,
      is_published: true,
      settings: {
        showcase: true,
        designPurpose: "lesson-ui-lab",
      },
    })),
    `blocks for ${section.title}`
  );

  return {
    section: insertedSection,
    blocks: blocks.map((block) => ({ ...block, section: insertedSection })),
  };
}

async function ensureShowcaseSections(supabase, lesson) {
  const desiredSections = createSections();
  const { data: existingSections, error } = await supabase
    .from("lesson_sections")
    .select("id, canonical_section_key, title, description, section_kind, position")
    .eq("lesson_id", lesson.id)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Could not read existing showcase sections: ${error.message}`);
  }

  const existingByKey = new Map(
    (existingSections ?? [])
      .filter((section) => section.canonical_section_key)
      .map((section) => [section.canonical_section_key, section])
  );

  const insertedSections = [];
  const insertedBlocks = [];

  for (const [index, section] of desiredSections.entries()) {
    const existingSection = existingByKey.get(section.canonical_section_key);

    if (existingSection) {
      if (
        existingSection.title !== section.title ||
        existingSection.description !== section.description ||
        existingSection.section_kind !== section.section_kind
      ) {
        const { error: updateError } = await supabase
          .from("lesson_sections")
          .update({
            title: section.title,
            description: section.description,
            section_kind: section.section_kind,
          })
          .eq("id", existingSection.id);

        if (updateError) {
          throw new Error(`Could not update showcase section metadata: ${updateError.message}`);
        }
      }

      continue;
    }

    const targetPosition = index + 1;
    await shiftLessonSectionsFromPosition(supabase, lesson.id, targetPosition);
    const inserted = await insertShowcaseSection(
      supabase,
      lesson.id,
      section,
      targetPosition
    );

    insertedSections.push(inserted.section);
    insertedBlocks.push(...inserted.blocks);
  }

  return {
    sections: insertedSections,
    blocks: insertedBlocks,
  };
}

async function createShowcaseLesson(supabase, module, questionSet, vocabulary, grammar) {
  const existingLesson = await maybeSingle(supabase, "lessons", "id, slug, title", {
    module_id: module.id,
    slug: LESSON_SLUG,
  });

  if (existingLesson) {
    const ensured = await ensureShowcaseSections(supabase, existingLesson);
    return {
      lesson: existingLesson,
      created: false,
      ensuredSections: ensured.sections,
      ensuredBlocks: ensured.blocks,
    };
  }

  const lesson = await insertOne(supabase, "lessons", {
    module_id: module.id,
    slug: LESSON_SLUG,
    title: "Lesson Design Showcase",
    summary:
      "A reference lesson that exercises every major lesson section, block, linked resource, and question renderer.",
    lesson_type: "showcase",
    position: await getNextLessonPosition(supabase, module.id),
    estimated_minutes: 25,
    is_published: true,
    is_trial_visible: true,
    requires_paid_access: false,
    available_in_volna: true,
    content_source: "db",
    content_key: `${SOURCE_KEY}:${SOURCE_VERSION}`,
  });

  const sections = [];
  const insertedBlocks = [];

  for (const [sectionIndex, section] of createSections().entries()) {
    const inserted = await insertShowcaseSection(
      supabase,
      lesson.id,
      section,
      sectionIndex + 1
    );

    sections.push(inserted.section);
    insertedBlocks.push(...inserted.blocks);
  }

  await insertOne(supabase, "lesson_question_sets", {
    lesson_id: lesson.id,
    question_set_id: questionSet.id,
    position: 1,
  });

  await insertOne(supabase, "lesson_vocabulary_set_usages", {
    lesson_id: lesson.id,
    vocabulary_set_id: vocabulary.vocabularySet.id,
    variant: VARIANT_SLUG,
    usage_type: "lesson_block",
  });

  const vocabularyBlock = insertedBlocks.find(
    (block) => block.block_type === "vocabulary-set"
  );

  if (vocabularyBlock) {
    await insertMany(
      supabase,
      "lesson_vocabulary_links",
      [
        {
          lesson_id: lesson.id,
          lesson_section_id: vocabularyBlock.lesson_section_id,
          lesson_block_id: vocabularyBlock.id,
          link_type: "set",
          vocabulary_set_id: vocabulary.vocabularySet.id,
          vocabulary_list_id: null,
          vocabulary_item_id: null,
          variant: VARIANT_SLUG,
          usage_type: "lesson_block",
        },
        {
          lesson_id: lesson.id,
          lesson_section_id: vocabularyBlock.lesson_section_id,
          lesson_block_id: vocabularyBlock.id,
          link_type: "list",
          vocabulary_set_id: null,
          vocabulary_list_id: vocabulary.vocabularyList?.id ?? null,
          vocabulary_item_id: null,
          variant: VARIANT_SLUG,
          usage_type: "lesson_block",
        },
      ].filter((link) => link.link_type !== "list" || link.vocabulary_list_id),
      "lesson vocabulary links"
    );
  }

  const grammarBlock = insertedBlocks.find((block) => block.block_type === "grammar-set");

  if (grammarBlock) {
    await insertMany(
      supabase,
      "lesson_grammar_links",
      [
        {
          lesson_id: lesson.id,
          lesson_section_id: grammarBlock.lesson_section_id,
          lesson_block_id: grammarBlock.id,
          link_type: "set",
          grammar_set_id: grammar.grammarSet.id,
          grammar_point_id: null,
          grammar_tag_key: null,
          variant: VARIANT_SLUG,
          usage_type: "lesson_block",
          position: 1,
        },
        ...grammar.grammarPoints.map((point, index) => ({
          lesson_id: lesson.id,
          lesson_section_id: grammarBlock.lesson_section_id,
          lesson_block_id: grammarBlock.id,
          link_type: "point",
          grammar_set_id: null,
          grammar_point_id: point.id,
          grammar_tag_key: null,
          variant: VARIANT_SLUG,
          usage_type: "explanation",
          position: index + 2,
        })),
      ],
      "lesson grammar links"
    );
  }

  return {
    lesson,
    sections,
    blocks: insertedBlocks,
    created: true,
  };
}

async function main() {
  const env = readEnvFile(ENV_PATH);
  const supabase = createClient(
    requireEnv(env, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(env, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
      },
    }
  );

  const { module } = await getFoundationModule(supabase);
  const [questionSet, vocabulary, grammar] = await Promise.all([
    ensureQuestionSet(supabase),
    ensureVocabularySet(supabase),
    ensureGrammarSet(supabase),
  ]);

  const result = await createShowcaseLesson(
    supabase,
    module,
    questionSet,
    vocabulary,
    grammar
  );

  const { data: lessonSections, error: lessonSectionsError } = await supabase
    .from("lesson_sections")
    .select("id, title, section_kind, position, canonical_section_key")
    .eq("lesson_id", result.lesson.id)
    .order("position", { ascending: true });

  if (lessonSectionsError) {
    throw new Error(`Could not read final showcase sections: ${lessonSectionsError.message}`);
  }

  const sectionIds = (lessonSections ?? []).map((section) => section.id);
  const { data: lessonBlocks, error: lessonBlocksError } = sectionIds.length
    ? await supabase
        .from("lesson_blocks")
        .select("id, lesson_section_id, block_type")
        .in("lesson_section_id", sectionIds)
    : { data: [], error: null };

  if (lessonBlocksError) {
    throw new Error(`Could not read final showcase blocks: ${lessonBlocksError.message}`);
  }

  const sectionCount = lessonSections?.length ?? 0;
  const blockCount = lessonBlocks?.length ?? 0;
  const url = `/courses/${COURSE_SLUG}/${VARIANT_SLUG}/modules/${MODULE_SLUG}/lessons/${LESSON_SLUG}`;

  console.log(
    JSON.stringify(
      {
        created: result.created,
        lessonId: result.lesson.id,
        lessonSlug: result.lesson.slug,
        url,
        sectionCount,
        blockCount,
        addedSectionCount: result.ensuredSections?.length ?? result.sections?.length ?? 0,
        addedBlockCount: result.ensuredBlocks?.length ?? result.blocks?.length ?? 0,
        sectionKinds: (lessonSections ?? []).map((section) => section.section_kind),
        linkedQuestionSet: QUESTION_SET_SLUG,
        linkedVocabularySet: VOCABULARY_SET_SLUG,
        linkedGrammarSet: GRAMMAR_SET_SLUG,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

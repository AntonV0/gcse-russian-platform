import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");

const COURSE_SLUG = "gcse-russian";
const VARIANT_SLUG = "foundation";
const MODULE_SLUG = "introduction-to-the-course";
const LESSON_SLUG = "introducing-yourself-in-russian";
const QUESTION_SET_SLUG = "introducing-yourself-in-russian-practice";
const GRAMMAR_SET_SLUG = "introducing-yourself-in-russian-grammar";
const SOURCE_KEY = "sample_introducing_yourself";
const SOURCE_VERSION = "v1";

const RU = {
  privet: "\u041f\u0440\u0438\u0432\u0435\u0442",
  zdravstvuyte: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435",
  menyaZovut: "\u041c\u0435\u043d\u044f \u0437\u043e\u0432\u0443\u0442...",
  menyaZovutAnton:
    "\u041c\u0435\u043d\u044f \u0437\u043e\u0432\u0443\u0442 \u0410\u043d\u0442\u043e\u043d.",
  kakTebyaZovut:
    "\u041a\u0430\u043a \u0442\u0435\u0431\u044f \u0437\u043e\u0432\u0443\u0442?",
  yaUchuRusskiy:
    "\u042f \u0443\u0447\u0443 \u0440\u0443\u0441\u0441\u043a\u0438\u0439.",
  ochenPriyatno:
    "\u041e\u0447\u0435\u043d\u044c \u043f\u0440\u0438\u044f\u0442\u043d\u043e.",
  aTebya: "\u0410 \u0442\u0435\u0431\u044f?",
};

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
  if (!value) throw new Error(`Missing required environment variable: ${key}`);

  return value;
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase();
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
    title: "Introducing Yourself in Russian - Practice",
    description: "Short checks for greeting someone and writing a first introduction.",
    instructions: "Answer each question, then check the feedback before moving on.",
    source_type: "lesson",
    is_template: false,
    template_type: null,
  });

  const questions = await insertMany(
    supabase,
    "questions",
    [
      {
        question_type: "multiple_choice",
        prompt: "Which phrase means My name is...?",
        explanation: `${RU.menyaZovut} is the phrase you need before your name.`,
        marks: 1,
        position: 1,
        metadata: { skill: "reading", checkpoint: "meaning" },
      },
      {
        question_type: "short_answer",
        prompt: "Type the Russian for hello.",
        explanation: `${RU.privet} is the friendly everyday word for hello.`,
        marks: 1,
        position: 2,
        metadata: { placeholder: "Type in Russian", skill: "recall" },
      },
      {
        question_type: "ordering",
        prompt: "Put the words in order to make: I study Russian.",
        explanation: `The sentence is ${RU.yaUchuRusskiy}`,
        marks: 2,
        position: 3,
        metadata: {
          items: ["\u0440\u0443\u0441\u0441\u043a\u0438\u0439", "\u042f", "\u0443\u0447\u0443"],
          correctOrder: [1, 2, 0],
          skill: "sentence-building",
        },
      },
      {
        question_type: "translation",
        prompt: "Translate into Russian: My name is Anton.",
        explanation: `Use the fixed phrase ${RU.menyaZovut}`,
        marks: 2,
        position: 4,
        metadata: {
          direction: "to_russian",
          sourceLanguageLabel: "English",
          targetLanguageLabel: "Russian",
          placeholder: "Type the Russian sentence",
          wordBank: [
            "\u041c\u0435\u043d\u044f",
            "\u0437\u043e\u0432\u0443\u0442",
            "\u0410\u043d\u0442\u043e\u043d",
          ],
          skill: "translation",
        },
      },
    ].map((question) => ({
      question_set_id: questionSet.id,
      difficulty: 1,
      is_active: true,
      ...question,
    })),
    "sample questions"
  );

  const byPosition = new Map(questions.map((question) => [question.position, question]));

  await insertMany(
    supabase,
    "question_options",
    [
      [RU.kakTebyaZovut, false, 1, 1],
      [RU.menyaZovut, true, 2, 1],
      [RU.ochenPriyatno, false, 3, 1],
    ].map(([optionText, isCorrect, position, questionPosition]) => ({
      question_id: byPosition.get(questionPosition).id,
      option_text: optionText,
      option_rich: null,
      is_correct: isCorrect,
      match_group: null,
      position,
    })),
    "sample question options"
  );

  await insertMany(
    supabase,
    "question_accepted_answers",
    [
      [2, RU.privet, true],
      [2, RU.privet.toLowerCase(), false],
      [4, RU.menyaZovutAnton, true],
      [
        4,
        "\u043c\u0435\u043d\u044f \u0437\u043e\u0432\u0443\u0442 \u0410\u043d\u0442\u043e\u043d",
        false,
      ],
    ].map(([questionPosition, answerText, isPrimary]) => ({
      question_id: byPosition.get(questionPosition).id,
      answer_text: answerText,
      normalized_answer: normalizeAnswer(answerText),
      is_primary: isPrimary,
      case_sensitive: false,
      notes: null,
    })),
    "sample accepted answers"
  );

  return questionSet;
}

async function ensureGrammarSet(supabase) {
  const existing = await maybeSingle(supabase, "grammar_sets", "id, slug", {
    slug: GRAMMAR_SET_SLUG,
  });
  if (existing) return { grammarSet: existing };

  const grammarSet = await insertOne(supabase, "grammar_sets", {
    slug: GRAMMAR_SET_SLUG,
    title: "First Introduction Sentences",
    description: "Two small sentence patterns for a first Russian introduction.",
    theme_key: "identity_and_culture",
    topic_key: "introductions",
    tier: "foundation",
    sort_order: 9001,
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
        slug: "menya-zovut-fixed-phrase",
        title: "Using \u041c\u0435\u043d\u044f \u0437\u043e\u0432\u0443\u0442...",
        short_description: "Use this fixed phrase before your name.",
        full_explanation:
          "\u041c\u0435\u043d\u044f \u0437\u043e\u0432\u0443\u0442... literally works differently from English, but at this stage you can learn it as a useful whole phrase.",
        grammar_tag_key: "starter-phrases",
        category_key: "phrases",
        knowledge_requirement: "productive",
      },
      {
        slug: "ya-uchu-russkiy-pattern",
        title: "Using \u042f \u0443\u0447\u0443 \u0440\u0443\u0441\u0441\u043a\u0438\u0439",
        short_description: "Say I study Russian with \u042f + \u0443\u0447\u0443 + \u0440\u0443\u0441\u0441\u043a\u0438\u0439.",
        full_explanation:
          "\u042f means I. \u0423\u0447\u0443 means I study or I learn. Together, \u042f \u0443\u0447\u0443 \u0440\u0443\u0441\u0441\u043a\u0438\u0439 gives a short, accurate sentence.",
        grammar_tag_key: "present-tense",
        category_key: "verbs",
        knowledge_requirement: "productive",
      },
    ].map((point, index) => ({
      grammar_set_id: grammarSet.id,
      ...point,
      spec_reference: "GCSE starter introduction language",
      receptive_scope: null,
      tier: "foundation",
      sort_order: (index + 1) * 10,
      is_published: true,
      source_key: SOURCE_KEY,
      source_version: SOURCE_VERSION,
      import_key: `${SOURCE_KEY}:grammar-point:${index + 1}`,
    })),
    "sample grammar points"
  );

  await insertMany(
    supabase,
    "grammar_examples",
    [
      [0, RU.menyaZovutAnton, "My name is Anton.", RU.menyaZovut, "A fixed phrase."],
      [1, RU.yaUchuRusskiy, "I study Russian.", "\u0443\u0447\u0443", "A short sentence pattern."],
    ].map(([pointIndex, russian_text, english_translation, optional_highlight, note]) => ({
      grammar_point_id: grammarPoints[pointIndex].id,
      russian_text,
      english_translation,
      optional_highlight,
      note,
      sort_order: 1,
    })),
    "sample grammar examples"
  );

  return { grammarSet };
}

function createSections() {
  return [
    {
      title: "Start Here",
      description: "Learn three useful phrases for a first conversation.",
      section_kind: "intro",
      canonical_section_key: "sample-intro-start",
      blocks: [
        {
          block_type: "header",
          data: { content: "By the end, you can introduce yourself in Russian." },
        },
        {
          block_type: "text",
          data: {
            content:
              "You will learn how to say hello, say your name, ask someone their name, and write one short sentence about studying Russian.",
          },
        },
        {
          block_type: "note",
          data: {
            title: "Keep it simple",
            content:
              "Do not worry about perfect pronunciation yet. First, recognise the phrases and use them in the right order.",
          },
        },
      ],
    },
    {
      title: "Useful Phrases",
      description: "Read the phrase, say it once, then check the meaning.",
      section_kind: "content",
      canonical_section_key: "sample-useful-phrases",
      blocks: [
        {
          block_type: "vocabulary",
          data: {
            title: "First introduction phrases",
            items: [
              { russian: RU.privet, english: "Hello" },
              { russian: RU.zdravstvuyte, english: "Hello / good day" },
              { russian: RU.menyaZovut, english: "My name is..." },
              { russian: RU.kakTebyaZovut, english: "What is your name?" },
              { russian: RU.yaUchuRusskiy, english: "I study Russian." },
              { russian: RU.ochenPriyatno, english: "Nice to meet you." },
            ],
          },
        },
      ],
    },
    {
      title: "How It Works",
      description: "Notice two sentence patterns you can reuse.",
      section_kind: "grammar",
      canonical_section_key: "sample-how-it-works",
      blocks: [
        {
          block_type: "grammar-set",
          data: {
            title: "Two patterns for a first introduction",
            grammarSetSlug: GRAMMAR_SET_SLUG,
          },
        },
        {
          block_type: "callout",
          data: {
            title: "Useful pattern",
            content: `${RU.menyaZovutAnton} = My name is Anton.`,
          },
        },
      ],
    },
    {
      title: "Read the Model",
      description: "Follow a short introduction before you make your own.",
      section_kind: "reading_practice",
      canonical_section_key: "sample-read-model",
      blocks: [
        {
          block_type: "text",
          data: {
            content: `${RU.privet}! ${RU.menyaZovutAnton} ${RU.aTebya}\n${RU.ochenPriyatno} ${RU.yaUchuRusskiy}`,
          },
        },
        {
          block_type: "multiple-choice",
          data: {
            question: `What does ${RU.aTebya} mean here?`,
            options: [
              { id: "a", text: "And you?" },
              { id: "b", text: "Nice to meet you." },
              { id: "c", text: "I study Russian." },
            ],
            correctOptionId: "a",
            explanation: `${RU.aTebya} is a short way to ask the same question back.`,
          },
        },
      ],
    },
    {
      title: "Say It Aloud",
      description: "Practise the rhythm before writing.",
      section_kind: "speaking_practice",
      canonical_section_key: "sample-speaking",
      blocks: [
        {
          block_type: "text",
          data: {
            content:
              "Say each phrase slowly. Pause after your name. Then say the whole mini introduction without stopping.",
          },
        },
        {
          block_type: "exam-tip",
          data: {
            title: "Speaking habit",
            content:
              "Clear and accurate is better than fast. In a speaking exam, a short sentence you can say confidently is valuable.",
          },
        },
      ],
    },
    {
      title: "Write Your Introduction",
      description: "Build one accurate sentence, then extend it.",
      section_kind: "writing_practice",
      canonical_section_key: "sample-writing",
      blocks: [
        {
          block_type: "text",
          data: {
            content:
              "Start with the model. Change the name if you want to make the sentence your own.",
          },
        },
        {
          block_type: "short-answer",
          data: {
            question: "Write in Russian: My name is Anton.",
            acceptedAnswers: [
              RU.menyaZovutAnton,
              "\u041c\u0435\u043d\u044f \u0437\u043e\u0432\u0443\u0442 \u0410\u043d\u0442\u043e\u043d",
            ],
            explanation: `Use ${RU.menyaZovut} before the name.`,
            placeholder: "\u041c\u0435\u043d\u044f ...",
          },
        },
      ],
    },
    {
      title: "Quick Practice",
      description: "Check the phrases before the recap.",
      section_kind: "practice",
      canonical_section_key: "sample-quick-practice",
      blocks: [
        {
          block_type: "question-set",
          data: {
            title: "Practise your first introduction",
            questionSetSlug: QUESTION_SET_SLUG,
          },
        },
      ],
    },
    {
      title: "Recap",
      description: "You now have a small introduction you can reuse.",
      section_kind: "summary",
      canonical_section_key: "sample-recap",
      blocks: [
        {
          block_type: "header",
          data: { content: "You can now introduce yourself." },
        },
        {
          block_type: "text",
          data: {
            content: `Try to remember this mini version: ${RU.privet}! ${RU.menyaZovutAnton} ${RU.yaUchuRusskiy}`,
          },
        },
        {
          block_type: "note",
          data: {
            title: "Next time",
            content:
              "You can add age, where you live, or why you are learning Russian.",
          },
        },
      ],
    },
  ];
}

async function createSampleLesson(supabase, module, questionSet, grammar) {
  const existingLesson = await maybeSingle(supabase, "lessons", "id, slug, title", {
    module_id: module.id,
    slug: LESSON_SLUG,
  });

  if (existingLesson) {
    return { lesson: existingLesson, created: false };
  }

  const lesson = await insertOne(supabase, "lessons", {
    module_id: module.id,
    slug: LESSON_SLUG,
    title: "Introducing Yourself in Russian",
    summary:
      "Learn how to greet someone, say your name, ask theirs, and write one short Russian sentence.",
    lesson_type: "sample",
    position: await getNextLessonPosition(supabase, module.id),
    estimated_minutes: 15,
    is_published: true,
    is_trial_visible: true,
    requires_paid_access: false,
    available_in_volna: true,
    content_source: "db",
    content_key: `${SOURCE_KEY}:${SOURCE_VERSION}`,
  });

  const sections = [];
  const blocks = [];

  for (const [sectionIndex, section] of createSections().entries()) {
    const insertedSection = await insertOne(supabase, "lesson_sections", {
      lesson_id: lesson.id,
      title: section.title,
      description: section.description,
      section_kind: section.section_kind,
      position: sectionIndex + 1,
      is_published: true,
      settings: {
        sample: true,
        designPurpose: "student-facing-sample",
        blockCount: section.blocks.length,
      },
      variant_visibility: "shared",
      canonical_section_key: section.canonical_section_key,
    });

    sections.push(insertedSection);

    const insertedBlocks = await insertMany(
      supabase,
      "lesson_blocks",
      section.blocks.map((block, blockIndex) => ({
        lesson_section_id: insertedSection.id,
        block_type: block.block_type,
        position: blockIndex + 1,
        data: block.data,
        is_published: true,
        settings: {
          sample: true,
          designPurpose: "student-facing-sample",
        },
      })),
      `blocks for ${section.title}`
    );

    blocks.push(...insertedBlocks);
  }

  await insertOne(supabase, "lesson_question_sets", {
    lesson_id: lesson.id,
    question_set_id: questionSet.id,
    position: 1,
  });

  const grammarBlock = blocks.find((block) => block.block_type === "grammar-set");
  if (grammarBlock) {
    await insertOne(supabase, "lesson_grammar_links", {
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
    });
  }

  return { lesson, sections, blocks, created: true };
}

async function getLessonCounts(supabase, lessonId) {
  const { data: sections, error: sectionsError } = await supabase
    .from("lesson_sections")
    .select("id, section_kind")
    .eq("lesson_id", lessonId)
    .order("position", { ascending: true });

  if (sectionsError) {
    throw new Error(`Could not read final sample sections: ${sectionsError.message}`);
  }

  const sectionIds = (sections ?? []).map((section) => section.id);
  const { data: blocks, error: blocksError } = sectionIds.length
    ? await supabase
        .from("lesson_blocks")
        .select("id")
        .in("lesson_section_id", sectionIds)
    : { data: [], error: null };

  if (blocksError) {
    throw new Error(`Could not read final sample blocks: ${blocksError.message}`);
  }

  return {
    sectionCount: sections?.length ?? 0,
    blockCount: blocks?.length ?? 0,
    sectionKinds: (sections ?? []).map((section) => section.section_kind),
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
  const [questionSet, grammar] = await Promise.all([
    ensureQuestionSet(supabase),
    ensureGrammarSet(supabase),
  ]);

  const result = await createSampleLesson(supabase, module, questionSet, grammar);
  const counts = await getLessonCounts(supabase, result.lesson.id);
  const url = `/courses/${COURSE_SLUG}/${VARIANT_SLUG}/modules/${MODULE_SLUG}/lessons/${LESSON_SLUG}`;

  console.log(
    JSON.stringify(
      {
        created: result.created,
        lessonId: result.lesson.id,
        lessonSlug: result.lesson.slug,
        url,
        ...counts,
        linkedQuestionSet: QUESTION_SET_SLUG,
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

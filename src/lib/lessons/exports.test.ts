import { describe, expect, it } from "vitest";
import {
  getLessonVocabularyResourceKey,
  renderLessonMarkdownExport,
  type LessonExportInput,
} from "@/lib/lessons/exports";
import type { GrammarExportPoint } from "@/lib/grammar/exports";
import type { DbGrammarSet } from "@/lib/grammar/types";
import type {
  DbQuestion,
  DbQuestionAcceptedAnswer,
  DbQuestionOption,
  DbQuestionSet,
} from "@/lib/questions/question-db-types";
import type {
  DbVocabularyItem,
  DbVocabularyList,
  DbVocabularySet,
} from "@/lib/vocabulary/shared/types";

function createLessonExportInput(): LessonExportInput {
  return {
    course: {
      title: "GCSE Russian",
      slug: "gcse-russian",
    },
    variant: {
      title: "Foundation",
      slug: "foundation",
    },
    module: {
      title: "Identity and culture",
      slug: "identity-and-culture",
    },
    lesson: {
      title: "Talking about family",
      slug: "talking-about-family",
      summary: "Family vocabulary and simple opinions.",
      lesson_type: "core",
      estimated_minutes: 35,
      is_published: true,
      is_trial_visible: false,
      requires_paid_access: true,
      available_in_volna: true,
      content_source: "builder",
      content_key: null,
    },
    sections: [
      {
        title: "Practice",
        description: null,
        section_kind: "practice",
        position: 2,
        is_published: false,
        variant_visibility: "higher_only",
        canonical_section_key: "family-practice",
        blocks: [
          {
            block_type: "question-set",
            position: 1,
            is_published: false,
            data: {
              title: "Family questions",
              questionSetSlug: "family-opinions-foundation",
            },
          },
          {
            block_type: "image",
            position: 2,
            is_published: true,
            data: {
              src: "/images/family-tree.png",
              alt: "Family tree",
              caption: "Family tree prompt",
            },
          },
        ],
      },
      {
        title: "Learn",
        description: "Build useful family sentences.",
        section_kind: "content",
        position: 1,
        is_published: true,
        variant_visibility: "shared",
        canonical_section_key: null,
        blocks: [
          {
            block_type: "text",
            position: 2,
            is_published: true,
            data: {
              content: "Use **это** to introduce family members.",
            },
          },
          {
            block_type: "header",
            position: 1,
            is_published: true,
            data: {
              content: "Family basics",
            },
          },
          {
            block_type: "vocabulary",
            position: 3,
            is_published: true,
            data: {
              title: "Family words",
              items: [
                { russian: "мама", english: "mum" },
                { russian: "брат", english: "brother" },
              ],
            },
          },
          {
            block_type: "exam-tip",
            position: 4,
            is_published: true,
            data: {
              title: "Add an opinion",
              content: "Give a reason after each opinion where possible.",
            },
          },
        ],
      },
    ],
  };
}

const linkedVocabularySet: DbVocabularySet = {
  id: "vocab-set-1",
  slug: "family-linked",
  title: "Linked family vocabulary",
  description: null,
  theme_key: null,
  topic_key: null,
  tier: "foundation",
  list_mode: "custom",
  set_type: "lesson_custom",
  default_display_variant: "two_column",
  is_published: false,
  is_trial_visible: false,
  requires_paid_access: true,
  available_in_volna: false,
  sort_order: 1,
  source_key: null,
  source_version: null,
  import_key: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const linkedVocabularyList: DbVocabularyList = {
  id: "vocab-list-1",
  vocabulary_set_id: "vocab-set-1",
  slug: "family-list",
  title: "Family list",
  description: null,
  theme_key: null,
  topic_key: null,
  category_key: null,
  subcategory_key: null,
  tier: "foundation",
  list_mode: "custom",
  default_display_variant: "two_column",
  is_published: false,
  sort_order: 1,
  source_key: null,
  source_version: null,
  source_section_ref: null,
  import_key: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const linkedVocabularyItem: DbVocabularyItem = {
  id: "vocab-item-1",
  vocabulary_set_id: "vocab-set-1",
  vocabulary_list_id: "vocab-list-1",
  canonical_key: null,
  russian: "mama",
  english: "mum",
  transliteration: null,
  example_ru: "Eto mama.",
  example_en: "This is mum.",
  audio_path: null,
  notes: null,
  item_type: "word",
  source_type: "custom",
  priority: "core",
  part_of_speech: "noun",
  gender: "feminine",
  plural: null,
  productive_receptive: "both",
  tier: "foundation",
  theme_key: null,
  topic_key: null,
  category_key: null,
  subcategory_key: null,
  aspect: "not_applicable",
  case_governed: null,
  is_reflexive: false,
  source_key: null,
  source_version: null,
  source_section_ref: null,
  import_key: null,
  position: 1,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const linkedGrammarSet: DbGrammarSet = {
  id: "grammar-set-1",
  slug: "cases-linked",
  title: "Linked cases",
  description: null,
  theme_key: null,
  topic_key: null,
  tier: "foundation",
  sort_order: 1,
  is_published: false,
  is_trial_visible: false,
  requires_paid_access: true,
  available_in_volna: false,
  source_key: null,
  source_version: null,
  import_key: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const linkedGrammarPoint: GrammarExportPoint = {
  id: "grammar-point-1",
  grammar_set_id: "grammar-set-1",
  slug: "prepositional",
  title: "Prepositional case",
  short_description: "Use after location prepositions.",
  full_explanation: "Use prepositional case after location meaning in or at.",
  spec_reference: null,
  grammar_tag_key: null,
  category_key: null,
  tier: "foundation",
  knowledge_requirement: "productive",
  receptive_scope: null,
  source_key: null,
  source_version: null,
  import_key: null,
  sort_order: 1,
  is_published: false,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
  examples: [
    {
      id: "grammar-example-1",
      grammar_point_id: "grammar-point-1",
      russian_text: "Ya v shkole.",
      english_translation: "I am at school.",
      optional_highlight: "v shkole",
      note: null,
      sort_order: 1,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-02T00:00:00.000Z",
    },
  ],
  tables: [
    {
      id: "grammar-table-1",
      grammar_point_id: "grammar-point-1",
      title: "Endings",
      columns: ["Base", "Prepositional"],
      rows: [["shkola", "shkole"]],
      optional_note: null,
      sort_order: 1,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-02T00:00:00.000Z",
    },
  ],
};

const linkedQuestionSet: DbQuestionSet = {
  id: "question-set-1",
  slug: "family-linked-questions",
  title: "Linked family questions",
  description: "Review family answers.",
  instructions: "Choose the best answer.",
  source_type: "custom",
  is_template: false,
  template_type: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const linkedQuestion: DbQuestion = {
  id: "question-1",
  question_set_id: "question-set-1",
  question_type: "multiple_choice",
  prompt: "What does mama mean?",
  prompt_rich: null,
  explanation: "Mama means mum.",
  difficulty: 1,
  marks: 1,
  audio_path: "/audio/family.mp3",
  image_path: null,
  metadata: {},
  position: 1,
  is_active: false,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const linkedQuestionOptions: DbQuestionOption[] = [
  {
    id: "option-1",
    question_id: "question-1",
    option_text: "mum",
    option_rich: null,
    is_correct: true,
    match_group: null,
    position: 1,
  },
  {
    id: "option-2",
    question_id: "question-1",
    option_text: "brother",
    option_rich: null,
    is_correct: false,
    match_group: null,
    position: 2,
  },
];

const linkedAcceptedAnswer: DbQuestionAcceptedAnswer = {
  id: "answer-1",
  question_id: "question-1",
  answer_text: "mum",
  normalized_answer: "mum",
  is_primary: true,
  case_sensitive: false,
  notes: "Accept British English.",
};

describe("renderLessonMarkdownExport", () => {
  it("renders lesson metadata and a stable review filename", () => {
    const exportResult = renderLessonMarkdownExport(createLessonExportInput());

    expect(exportResult.filename).toBe(
      "gcse-russian-foundation-identity-and-culture-talking-about-family-review.md"
    );
    expect(exportResult.markdown).toContain("# Talking about family");
    expect(exportResult.markdown).toContain("- Course: GCSE Russian (`gcse-russian`)");
    expect(exportResult.markdown).toContain("- Estimated minutes: 35");
    expect(exportResult.markdown).toContain("- Published: Yes");
    expect(exportResult.markdown).toContain("- Requires paid access: Yes");
    expect(exportResult.markdown).toContain("- Summary: Family vocabulary");
  });

  it("sorts sections and blocks by position", () => {
    const exportResult = renderLessonMarkdownExport(createLessonExportInput());

    const learnIndex = exportResult.markdown.indexOf("## 1. Learn (Published)");
    const practiceIndex = exportResult.markdown.indexOf("## 2. Practice (Draft)");
    const headerIndex = exportResult.markdown.indexOf("### Family basics");
    const textIndex = exportResult.markdown.indexOf("Use **это**");

    expect(learnIndex).toBeGreaterThan(-1);
    expect(practiceIndex).toBeGreaterThan(learnIndex);
    expect(headerIndex).toBeGreaterThan(learnIndex);
    expect(textIndex).toBeGreaterThan(headerIndex);
  });

  it("renders reviewable content blocks and references linked/media blocks", () => {
    const exportResult = renderLessonMarkdownExport(createLessonExportInput());

    expect(exportResult.markdown).toContain("| мама | mum |");
    expect(exportResult.markdown).toContain("| брат | brother |");
    expect(exportResult.markdown).toContain("**Exam tip: Add an opinion**");
    expect(exportResult.markdown).toContain(
      "Give a reason after each opinion where possible."
    );
    expect(exportResult.markdown).toContain("**Reference: Question set**");
    expect(exportResult.markdown).toContain(
      "questionSetSlug: `family-opinions-foundation`"
    );
    expect(exportResult.markdown).toContain("**Reference: Image**");
    expect(exportResult.markdown).toContain("src: `/images/family-tree.png`");
  });

  it("includes linked vocabulary sets inline when resource data is provided", () => {
    const input = createLessonExportInput();
    input.sections[0].blocks.unshift({
      block_type: "vocabulary-set",
      position: 0,
      is_published: false,
      data: {
        title: "Family set block",
        vocabularySetSlug: "family-linked",
        vocabularyListSlug: "family-list",
      },
    });
    input.linkedResources = {
      vocabularySets: {
        [getLessonVocabularyResourceKey({
          vocabularySetSlug: "family-linked",
          vocabularyListSlug: "family-list",
        })]: {
          vocabularySet: linkedVocabularySet,
          vocabularyList: linkedVocabularyList,
          lists: [linkedVocabularyList],
          items: [linkedVocabularyItem],
        },
      },
    };

    const exportResult = renderLessonMarkdownExport(input);

    expect(exportResult.markdown).toContain(
      "**Linked vocabulary set: Family set block**"
    );
    expect(exportResult.markdown).toContain(
      "- Set: Linked family vocabulary (`family-linked`)"
    );
    expect(exportResult.markdown).toContain("#### 1. Family list (Draft)");
    expect(exportResult.markdown).toContain("| 1 | mama | mum |");
  });

  it("includes linked grammar sets inline when resource data is provided", () => {
    const input = createLessonExportInput();
    input.sections[0].blocks.unshift({
      block_type: "grammar-set",
      position: 0,
      is_published: false,
      data: {
        title: "Cases block",
        grammarSetSlug: "cases-linked",
      },
    });
    input.linkedResources = {
      grammarSets: {
        "cases-linked": {
          grammarSet: linkedGrammarSet,
          points: [linkedGrammarPoint],
        },
      },
    };

    const exportResult = renderLessonMarkdownExport(input);

    expect(exportResult.markdown).toContain("**Linked grammar set: Cases block**");
    expect(exportResult.markdown).toContain("#### 1. Prepositional case (Draft)");
    expect(exportResult.markdown).toContain("Use prepositional case after location");
    expect(exportResult.markdown).toContain("| Ya v shkole. | I am at school.");
    expect(exportResult.markdown).toContain("| Base | Prepositional |");
  });

  it("includes linked question sets inline when resource data is provided", () => {
    const input = createLessonExportInput();
    input.linkedResources = {
      questionSets: {
        "family-opinions-foundation": {
          questionSet: linkedQuestionSet,
          questions: [linkedQuestion],
          options: linkedQuestionOptions,
          acceptedAnswers: [linkedAcceptedAnswer],
        },
      },
    };

    const exportResult = renderLessonMarkdownExport(input);

    expect(exportResult.markdown).toContain("**Linked question set: Family questions**");
    expect(exportResult.markdown).toContain(
      "#### Question 1: multiple_choice (Inactive)"
    );
    expect(exportResult.markdown).toContain("What does mama mean?");
    expect(exportResult.markdown).toContain("| 1 | mum | Yes |");
    expect(exportResult.markdown).toContain(
      "| 1 | mum | Yes | No | Accept British English. |"
    );
    expect(exportResult.markdown).toContain("- Audio reference: `/audio/family.mp3`");
  });

  it("falls back gracefully when a linked resource is missing", () => {
    const input = createLessonExportInput();
    input.linkedResources = {
      questionSets: {},
    };

    const exportResult = renderLessonMarkdownExport(input);

    expect(exportResult.markdown).toContain("**Reference: Question set**");
    expect(exportResult.markdown).toContain(
      "_Missing linked question set; it may have been deleted or the saved slug may be stale._"
    );
  });

  it("continues to reference media blocks rather than embedding them", () => {
    const exportResult = renderLessonMarkdownExport({
      ...createLessonExportInput(),
      linkedResources: {
        questionSets: {},
        vocabularySets: {},
        grammarSets: {},
      },
    });

    expect(exportResult.markdown).toContain("**Reference: Image**");
    expect(exportResult.markdown).toContain("src: `/images/family-tree.png`");
    expect(exportResult.markdown).not.toContain("![](/images/family-tree.png)");
    expect(exportResult.markdown).not.toContain(
      "![Family tree](/images/family-tree.png)"
    );
  });
});

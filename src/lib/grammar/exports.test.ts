import { describe, expect, it } from "vitest";
import {
  renderGrammarMarkdownExport,
  type GrammarExportInput,
  type GrammarExportPoint,
} from "@/lib/grammar/exports";
import type { DbGrammarSet } from "@/lib/grammar/types";

const baseGrammarSet: DbGrammarSet = {
  id: "set-1",
  slug: "cases-foundation",
  title: "Cases foundation",
  description: "Core GCSE Russian case patterns.",
  theme_key: "high_frequency_language",
  topic_key: "cases",
  tier: "foundation",
  sort_order: 1,
  is_published: true,
  is_trial_visible: true,
  requires_paid_access: false,
  available_in_volna: true,
  source_key: "teacher-notes",
  source_version: "v1",
  import_key: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

function createPoint(overrides: Partial<GrammarExportPoint>): GrammarExportPoint {
  return {
    id: "point-1",
    grammar_set_id: "set-1",
    slug: "prepositional-place",
    title: "Prepositional after place",
    short_description: "Use the prepositional case after в and на for location.",
    full_explanation:
      "After **в** or **на** meaning location, use the prepositional case.",
    spec_reference: "Grammar 2.1",
    grammar_tag_key: "cases",
    category_key: "cases",
    tier: "foundation",
    knowledge_requirement: "productive",
    receptive_scope: null,
    source_key: "teacher-notes",
    source_version: "v1",
    import_key: "grammar-import",
    sort_order: 2,
    is_published: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-02T00:00:00.000Z",
    examples: [
      {
        id: "example-2",
        grammar_point_id: "point-1",
        russian_text: "Я живу в Москве.",
        english_translation: "I live in Moscow.",
        optional_highlight: "в Москве",
        note: "Location, not movement.",
        sort_order: 2,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      },
      {
        id: "example-1",
        grammar_point_id: "point-1",
        russian_text: "Он в школе.",
        english_translation: "He is at school.",
        optional_highlight: null,
        note: null,
        sort_order: 1,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      },
    ],
    tables: [
      {
        id: "table-1",
        grammar_point_id: "point-1",
        title: "Common endings",
        columns: ["Noun", "Prepositional"],
        rows: [
          ["школа", "школе"],
          ["музей", "музее"],
        ],
        optional_note: "Teacher check: include spelling note.",
        sort_order: 1,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      },
    ],
    ...overrides,
  };
}

function createGrammarExportInput(
  overrides?: Partial<GrammarExportInput>
): GrammarExportInput {
  return {
    grammarSet: baseGrammarSet,
    points: [
      createPoint({
        id: "point-2",
        slug: "later-point",
        title: "Later point",
        sort_order: 2,
      }),
      createPoint({
        id: "point-1",
        slug: "earlier-point",
        title: "Earlier point",
        sort_order: 1,
      }),
    ],
    ...overrides,
  };
}

describe("renderGrammarMarkdownExport", () => {
  it("renders set metadata and a stable filename", () => {
    const exportResult = renderGrammarMarkdownExport(createGrammarExportInput());

    expect(exportResult.filename).toBe("cases-foundation-review.md");
    expect(exportResult.markdown).toContain("# Cases foundation");
    expect(exportResult.markdown).toContain("- Tier: Foundation");
    expect(exportResult.markdown).toContain("- Published: Yes");
    expect(exportResult.markdown).toContain("- Trial visible: Yes");
    expect(exportResult.markdown).toContain("- Requires paid access: No");
    expect(exportResult.markdown).toContain("- Source key: teacher-notes");
  });

  it("sorts grammar points and examples deterministically", () => {
    const exportResult = renderGrammarMarkdownExport(createGrammarExportInput());

    const earlierIndex = exportResult.markdown.indexOf("## 1. Earlier point");
    const laterIndex = exportResult.markdown.indexOf("## 2. Later point");
    const schoolIndex = exportResult.markdown.indexOf("| 1 | Он в школе.");
    const moscowIndex = exportResult.markdown.indexOf("| 2 | Я живу в Москве.");

    expect(earlierIndex).toBeGreaterThan(-1);
    expect(laterIndex).toBeGreaterThan(earlierIndex);
    expect(schoolIndex).toBeGreaterThan(earlierIndex);
    expect(moscowIndex).toBeGreaterThan(schoolIndex);
  });

  it("renders point explanations, examples, and Markdown tables", () => {
    const exportResult = renderGrammarMarkdownExport(createGrammarExportInput());

    expect(exportResult.markdown).toContain("After **в** or **на**");
    expect(exportResult.markdown).toContain("| Russian | English | Highlight | Notes |");
    expect(exportResult.markdown).toContain("| Я живу в Москве. | I live in Moscow.");
    expect(exportResult.markdown).toContain("#### Table 1: Common endings");
    expect(exportResult.markdown).toContain("| Noun | Prepositional |");
    expect(exportResult.markdown).toContain("| школа | школе |");
  });

  it("renders missing point content explicitly", () => {
    const exportResult = renderGrammarMarkdownExport(
      createGrammarExportInput({
        points: [
          createPoint({
            full_explanation: null,
            examples: [],
            tables: [
              {
                id: "table-2",
                grammar_point_id: "point-1",
                title: "Fallback columns",
                columns: [],
                rows: [["я", "меня"]],
                optional_note: null,
                sort_order: 1,
                created_at: "2026-01-01T00:00:00.000Z",
                updated_at: "2026-01-02T00:00:00.000Z",
              },
            ],
          }),
        ],
      })
    );

    expect(exportResult.markdown).toContain("_No explanation available._");
    expect(exportResult.markdown).toContain("_No examples available._");
    expect(exportResult.markdown).toContain("| Column 1 | Column 2 |");
    expect(exportResult.markdown).toContain("| я | меня |");
  });
});

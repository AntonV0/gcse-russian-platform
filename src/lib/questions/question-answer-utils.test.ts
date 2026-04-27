import { describe, expect, it } from "vitest";
import {
  collapseWhitespace,
  dedupeTexts,
  getNumberArray,
  getRecordArray,
  getStringArray,
  normalizeFreeTextAnswer,
  tokenizeSentenceBuilderText,
} from "@/lib/questions/question-answer-utils";

describe("question answer normalization helpers", () => {
  it("collapses repeated whitespace and trims surrounding space", () => {
    expect(collapseWhitespace("  one \n\t two   three  ")).toBe("one two three");
  });

  it("normalizes case, punctuation, articles, and whitespace when requested", () => {
    expect(
      normalizeFreeTextAnswer("  The, QUICK fox!  ", {
        ignorePunctuation: true,
        ignoreArticles: true,
      })
    ).toBe("quick fox");
  });

  it("can preserve internal whitespace while still trimming", () => {
    expect(
      normalizeFreeTextAnswer("  A   B  ", {
        collapseWhitespace: false,
      })
    ).toBe("a   b");
  });

  it("deduplicates answer texts by normalized value", () => {
    expect(dedupeTexts([" Да ", "да", "Нет", ""])).toEqual([" Да ", "Нет"]);
  });

  it("tokenizes sentence-builder text into non-empty words", () => {
    expect(tokenizeSentenceBuilderText("  я   люблю   русский  ")).toEqual([
      "я",
      "люблю",
      "русский",
    ]);
  });

  it("filters unknown payloads to supported primitive arrays", () => {
    expect(getStringArray(["a", "", " b ", 1])).toEqual(["a", " b "]);
    expect(getNumberArray([0, 2, -1, 1.5, "3"])).toEqual([0, 2]);
    expect(getRecordArray([{ id: "a" }, null, [], "x"])).toEqual([{ id: "a" }]);
  });
});

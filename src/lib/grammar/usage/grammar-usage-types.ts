export type GrammarUsageVariant = "foundation" | "higher" | "volna";

export type LessonGrammarLinkRow = {
  lesson_id: string;
  lesson_section_id?: string;
  lesson_block_id?: string;
  link_type: "set" | "point" | "tag";
  grammar_set_id?: string;
  grammar_point_id?: string;
  grammar_tag_key?: string;
  variant: GrammarUsageVariant;
  usage_type: "lesson_block" | "lesson_page" | "explanation" | "practice" | "other";
  position: number;
};

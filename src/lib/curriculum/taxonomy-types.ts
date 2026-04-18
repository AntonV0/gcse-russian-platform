export type TierKey = "foundation" | "higher" | "both";

export type SkillKey = "listening" | "speaking" | "reading" | "writing";

export type AssessmentObjectiveKey =
  | "ao1_listening"
  | "ao2_speaking"
  | "ao3_reading"
  | "ao4_writing";

export type PaperKey =
  | "paper_1_listening"
  | "paper_2_speaking"
  | "paper_3_reading"
  | "paper_4_writing";

export type PaperTaskKey =
  | "listening_comprehension"
  | "speaking_role_play"
  | "speaking_picture_task"
  | "speaking_conversation"
  | "reading_comprehension"
  | "reading_translation_ru_to_en"
  | "writing_short_response"
  | "writing_formal_response"
  | "writing_informal_extended_response"
  | "writing_formal_extended_response"
  | "writing_translation_en_to_ru";

export type ThemeKey =
  | "identity_and_culture"
  | "local_area_holiday_travel"
  | "school"
  | "future_aspirations_study_work"
  | "international_global_dimension";

export type TopicKey =
  | "who_am_i"
  | "daily_life"
  | "cultural_life"
  | "holidays"
  | "travel_and_tourist_transactions"
  | "town_region_country"
  | "what_school_is_like"
  | "school_activities"
  | "using_languages_beyond_the_classroom"
  | "ambitions"
  | "work"
  | "bringing_the_world_together"
  | "environmental_issues";

export type ContentPurposeKey =
  | "core_teaching"
  | "guided_practice"
  | "retrieval_practice"
  | "exam_technique"
  | "translation_practice"
  | "speaking_practice"
  | "listening_practice"
  | "reading_practice"
  | "writing_practice"
  | "grammar_focus"
  | "vocabulary_focus"
  | "revision"
  | "mock_exam"
  | "onboarding"
  | "reference";

export type GrammarCategoryKey =
  | "noun"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "verb"
  | "construction"
  | "number"
  | "time"
  | "preposition"
  | "conjunction";

export type GrammarTagKey =
  | "nouns"
  | "adjectives"
  | "adverbs"
  | "pronouns"
  | "possessives"
  | "present_tense"
  | "past_tense"
  | "future_tense"
  | "reflexive_verbs"
  | "imperatives"
  | "verbs_of_motion"
  | "impersonal_constructions"
  | "numbers_and_quantity"
  | "times_and_dates"
  | "negation"
  | "prepositions"
  | "conjunctions"
  | "comparatives"
  | "superlatives"
  | "short_form_adjectives"
  | "perfective_future"
  | "complex_pronoun_usage"
  | "svoy"
  | "advanced_negation";

export type VocabularyDomainKey = "high_frequency" | "topic_specific";

export type VocabularyTagKey =
  | "high_frequency_common_verbs"
  | "high_frequency_common_adjectives"
  | "high_frequency_common_adverbs"
  | "high_frequency_prepositions"
  | "high_frequency_colours"
  | "high_frequency_numbers"
  | "high_frequency_time"
  | "high_frequency_countries_and_nationalities"
  | "high_frequency_social_conventions"
  | "identity_and_culture_family_and_relationships"
  | "identity_and_culture_food_and_drink"
  | "identity_and_culture_clothes_and_style"
  | "local_area_holiday_travel"
  | "travel_transactions"
  | "school_life"
  | "school_activities_vocab"
  | "future_study_and_work"
  | "international_events_and_causes"
  | "environmental_issues_vocab";

export type CurriculumRegistryItem<TKey extends string> = {
  key: TKey;
  label: string;
  order: number;
};

export type TierRegistryItem = CurriculumRegistryItem<TierKey> & {
  shortLabel: string;
};

export type SkillRegistryItem = CurriculumRegistryItem<SkillKey>;

export type AssessmentObjectiveRegistryItem =
  CurriculumRegistryItem<AssessmentObjectiveKey> & {
    skillKey: SkillKey;
  };

export type PaperRegistryItem = CurriculumRegistryItem<PaperKey> & {
  shortLabel: string;
  paperNumber: number;
  skillKey: SkillKey;
  assessmentObjectiveKey: AssessmentObjectiveKey;
  tier: TierKey;
};

export type PaperTaskRegistryItem = CurriculumRegistryItem<PaperTaskKey> & {
  paperKey: PaperKey;
  tier: TierKey;
};

export type ThemeRegistryItem = CurriculumRegistryItem<ThemeKey>;

export type TopicRegistryItem = CurriculumRegistryItem<TopicKey> & {
  themeKey: ThemeKey;
};

export type ContentPurposeRegistryItem = CurriculumRegistryItem<ContentPurposeKey>;

export type GrammarTagRegistryItem = CurriculumRegistryItem<GrammarTagKey> & {
  tier: TierKey;
  category: GrammarCategoryKey;
};

export type VocabularyTagRegistryItem = CurriculumRegistryItem<VocabularyTagKey> & {
  domain: VocabularyDomainKey;
  tier: TierKey;
  themeKey?: ThemeKey;
};

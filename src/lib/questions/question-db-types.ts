export type DbQuestionSet = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  instructions: string | null;
  source_type: string;
  is_template: boolean;
  template_type: string | null;
  created_at: string;
  updated_at: string;
};

export type DbQuestion = {
  id: string;
  question_set_id: string;
  question_type: string;
  prompt: string;
  prompt_rich: unknown;
  explanation: string | null;
  difficulty: number | null;
  marks: number;
  audio_path: string | null;
  image_path: string | null;
  metadata: Record<string, unknown>;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbQuestionOption = {
  id: string;
  question_id: string;
  option_text: string | null;
  option_rich: unknown;
  is_correct: boolean | null;
  match_group: string | null;
  position: number;
};

export type DbQuestionAcceptedAnswer = {
  id: string;
  question_id: string;
  answer_text: string;
  normalized_answer: string | null;
  is_primary: boolean;
  case_sensitive: boolean;
  notes: string | null;
};

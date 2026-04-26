import type { MockExamQuestionType } from "@/lib/mock-exams/db";

export const mockExamQuestionDataTemplates: Record<MockExamQuestionType, string> = {
  multiple_choice: JSON.stringify(
    { options: ["Option A", "Option B"], correctAnswers: [0] },
    null,
    2
  ),
  multiple_response: JSON.stringify(
    { options: ["Option A", "Option B", "Option C"], correctAnswers: [0, 2] },
    null,
    2
  ),
  short_answer: JSON.stringify({ acceptedAnswers: ["answer"] }, null, 2),
  gap_fill: JSON.stringify(
    {
      text: "Complete the sentence: I live in ____.",
      gaps: [{ acceptedAnswers: ["London"] }],
    },
    null,
    2
  ),
  matching: JSON.stringify(
    {
      prompts: ["Person 1", "Person 2"],
      options: ["Activity A", "Activity B"],
      correctMatches: [0, 1],
    },
    null,
    2
  ),
  sequencing: JSON.stringify(
    { items: ["First event", "Second event"], correctOrder: [0, 1] },
    null,
    2
  ),
  opinion_recognition: JSON.stringify(
    { statements: ["The speaker likes school."], answers: ["positive"] },
    null,
    2
  ),
  true_false_not_mentioned: JSON.stringify(
    { statements: ["The text mentions a holiday."], answers: ["true"] },
    null,
    2
  ),
  translation_into_english: JSON.stringify({ sourceText: "Russian text here" }, null, 2),
  translation_into_russian: JSON.stringify(
    { sourceText: "English text here", sentences: ["I live in London."] },
    null,
    2
  ),
  writing_task: JSON.stringify(
    {
      bullets: ["Bullet 1", "Bullet 2"],
      recommendedWordCount: 90,
      responseWorkflow: {
        responseMode: "handwriting_upload",
        uploadRequired: true,
        allowTypedDraft: true,
      },
      markingMetadata: {
        wordCountGuidance: "Approximately 90 words",
        criteria: [
          { label: "Content", description: "Communication and coverage of task bullets" },
        ],
      },
    },
    null,
    2
  ),
  simple_sentences: JSON.stringify(
    {
      bullets: ["Say where you live", "Say what you like"],
      expectedSentences: 2,
      responseWorkflow: {
        responseMode: "tile_builder",
        allowTypedDraft: true,
      },
    },
    null,
    2
  ),
  short_paragraph: JSON.stringify(
    {
      bullets: ["Your school", "Your opinion"],
      minWordCount: 40,
      responseWorkflow: {
        responseMode: "handwriting_upload",
        uploadRequired: true,
        allowTypedDraft: true,
      },
      markingMetadata: {
        wordCountGuidance: "Short paragraph",
        criteria: [
          { label: "Communication", description: "Clear response to the prompt" },
        ],
      },
    },
    null,
    2
  ),
  extended_writing: JSON.stringify(
    {
      prompts: ["Write about your free time."],
      minWordCount: 90,
      responseWorkflow: {
        responseMode: "handwriting_upload",
        uploadRequired: true,
        allowTypedDraft: true,
      },
      markingMetadata: {
        wordCountGuidance: "Extended GCSE-style writing response",
        criteria: [
          { label: "Content", description: "Task coverage, clarity, and development" },
        ],
      },
    },
    null,
    2
  ),
  role_play: JSON.stringify(
    {
      scenario: "You are speaking to a friend.",
      prompts: [{ text: "Ask one question.", type: "question" }],
      responseWorkflow: {
        responseMode: "audio_recording",
        allowAudioRecording: true,
      },
      markingMetadata: {
        criteria: [
          { label: "Communication", description: "Clear response to each prompt" },
        ],
      },
    },
    null,
    2
  ),
  photo_card: JSON.stringify(
    {
      imageUrl: "",
      prompts: ["Describe the photo.", "Give your opinion."],
      responseWorkflow: {
        responseMode: "audio_recording",
        allowAudioRecording: true,
        allowTypedDraft: true,
      },
      markingMetadata: {
        criteria: [
          { label: "Response", description: "Description, opinion, and development" },
        ],
      },
    },
    null,
    2
  ),
  conversation: JSON.stringify(
    {
      theme: "School",
      questions: ["What is your favourite subject?"],
      responseWorkflow: {
        responseMode: "audio_recording",
        allowAudioRecording: true,
      },
      markingMetadata: {
        criteria: [{ label: "Fluency", description: "Developed spoken responses" }],
      },
    },
    null,
    2
  ),
  sentence_builder: JSON.stringify(
    { wordBank: ["I", "live", "in", "London"], acceptedAnswers: ["I live in London"] },
    null,
    2
  ),
  note_completion: JSON.stringify(
    { fields: [{ prompt: "Time", acceptedAnswers: ["three o'clock"] }] },
    null,
    2
  ),
  listening_comprehension: JSON.stringify(
    {
      audioUrl: "",
      transcript: "",
      questions: [],
      taskContext: {
        taskContext: "listening_task",
        stimulus: { kind: "audio", audioUrl: "", transcript: "", replayLimit: 2 },
        childInteractionTypes: ["single_choice", "matching", "short_answer_en"],
      },
    },
    null,
    2
  ),
  reading_comprehension: JSON.stringify(
    {
      text: "Reading text here",
      questions: [],
      taskContext: {
        taskContext: "reading_task",
        stimulus: { kind: "text", text: "Reading text here" },
        childInteractionTypes: ["single_choice", "matching", "short_answer_en"],
      },
    },
    null,
    2
  ),
  other: JSON.stringify({}, null, 2),
};

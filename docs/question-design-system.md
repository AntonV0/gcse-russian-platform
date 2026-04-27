---
title: "Question Design System (GCSE Russian Platform)"
sourceType: "internal"
isPublic: false
status: phase_5_bridge_scaffold
buildPriority: critical
lastReviewed: "2026-04-25"
---

# Question Design System

This file defines the phase 1 taxonomy for the GCSE Russian question system.
It is a design-system reference, not a schema migration.

Phase 1 goals:

- define a stable question taxonomy
- map existing question-set types to the final taxonomy
- map existing mock exam types to the final taxonomy
- protect the key product principle: students should generally not need to type Russian
- create a safe bridge for later renderer, admin, and data model work

Phase 1 does not:

- change the database
- change admin forms
- change student renderers
- change marking behaviour
- remove existing question types

## Implementation Status

Phase 1 is complete: the shared taxonomy and compatibility maps exist.

Phase 2 is complete in the current codebase: question sets now support shared
digital interactions for multiple response, matching, ordering, word-bank gap
fill, and categorisation, with admin authoring and structured validation.

Phase 3 is scaffolded: reading and listening tasks can now carry parent stimulus
metadata, child question-set links, replay limits, and time limits in mock exam
question data. This does not yet change student rendering.

Phase 4 is scaffolded: writing and speaking mock tasks can now carry response
workflow metadata and future AI/teacher marking metadata, including criteria,
level descriptors, mark scheme references, and word-count guidance. This does
not yet implement uploads or recording storage.

Phase 5 is scaffolded: mock exam question types and reusable question-set types
now have a shared bridge into the question design taxonomy. Mock exams still use
their existing runtime renderer, but new records can preserve the shared
interaction/task metadata needed for unification.

## Core Principle

Russian-language production should be digital-first and scaffolded.

Prefer:

- selecting
- matching
- ordering
- categorising
- filling gaps from word banks
- clicking words or phrases
- building sentences from tiles
- uploading handwritten work for longer writing

Avoid as the default:

- typing Russian
- typing Cyrillic under time pressure
- entering ordered answers as comma-separated numbers

Typing is acceptable for:

- short answers in English
- translation into English
- English planning notes
- optional advanced Russian drafts

## Two-Layer Taxonomy

Every future question should be described by:

1. task context
2. interaction type

The task context says what kind of learning or exam situation the question belongs to.
The interaction type says what the student actually does on screen.

This distinction prevents a type such as `translation` from hiding several different
student experiences.

## Task Contexts

| Key                   | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `standalone_practice` | A single practice question or drill.                          |
| `question_set`        | A reusable set of practice questions.                         |
| `lesson_practice`     | Practice embedded in a lesson section.                        |
| `reading_task`        | A reading stimulus with one or more linked questions.         |
| `listening_task`      | An audio stimulus with one or more linked questions.          |
| `writing_task`        | A writing prompt, scaffold, draft, or upload task.            |
| `speaking_task`       | Role play, photo card, conversation, recording, or prep task. |
| `mock_exam_section`   | A section inside a mock exam attempt.                         |
| `assignment_task`     | A teacher-assigned question/task.                             |

## Interaction Types

### Objective and Selection

| Key                        | Student action                                    | Russian typing risk |
| -------------------------- | ------------------------------------------------- | ------------------- |
| `single_choice`            | Select one answer.                                | None                |
| `multi_select`             | Select more than one answer.                      | None                |
| `true_false_not_mentioned` | Choose true, false, or not mentioned.             | None                |
| `matching`                 | Match prompts to options.                         | None                |
| `categorisation`           | Sort items into categories.                       | None                |
| `ordering`                 | Put items/events/phrases in order.                | None                |
| `word_bank_gap_fill`       | Fill gaps using provided words.                   | Low                 |
| `dropdown_gap_fill`        | Choose one option per gap.                        | None                |
| `table_completion`         | Complete table cells, ideally using choices.      | Low                 |
| `click_text`               | Click words/phrases in a text.                    | None                |
| `opinion_recognition`      | Identify positive, negative, neutral, or similar. | None                |
| `speaker_identification`   | Match information to speakers.                    | None                |

### Controlled Russian Production

| Key                             | Student action                                 | Russian typing risk |
| ------------------------------- | ---------------------------------------------- | ------------------- |
| `sentence_builder`              | Build a sentence from tiles.                   | None                |
| `phrase_builder`                | Build a phrase from tiles.                     | None                |
| `translation_en_ru_tiles`       | Translate into Russian using selectable tiles. | None                |
| `grammar_form_selection`        | Choose the correct grammar form.               | None                |
| `verb_form_selection`           | Choose the correct verb form.                  | None                |
| `sentence_transformation_tiles` | Transform a sentence using provided pieces.    | None                |
| `error_spotting`                | Identify an error.                             | None                |
| `error_correction_selection`    | Correct an error using choices.                | None                |

### Typed English or Meaning Transfer

| Key                  | Student action                    | Russian typing risk |
| -------------------- | --------------------------------- | ------------------- |
| `short_answer_en`    | Type a short English answer.      | None                |
| `note_completion_en` | Type short English notes/details. | None                |
| `translation_ru_en`  | Translate Russian into English.   | None                |
| `summary_answer_en`  | Type a concise English summary.   | None                |

### Long Response and Marked Work

| Key                      | Student action                           | Russian typing risk |
| ------------------------ | ---------------------------------------- | ------------------- |
| `writing_upload`         | Upload handwritten writing.              | None in app         |
| `writing_draft_optional` | Type optional draft/planning.            | Optional            |
| `speaking_recording`     | Record spoken response.                  | None                |
| `speaking_prep_notes`    | Type English prep notes or use prompts.  | None                |
| `role_play_response`     | Respond to role-play prompts.            | Optional            |
| `photo_card_response`    | Prepare/respond to photo prompts.        | Optional            |
| `conversation_response`  | Prepare/respond to conversation prompts. | Optional            |

### Escape Hatch

| Key                      | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `manual_marked_response` | Generic response field for unusual tasks awaiting a proper interaction. |

Use the escape hatch sparingly. It is useful during migration, but it should not
be the default authoring path.

## Existing Question Set Compatibility

Current question-set types are defined in the reusable practice engine.

| Existing type     | Existing metadata                  | Final interaction mapping                                              | Status                                                 |
| ----------------- | ---------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| `multiple_choice` | Options table                      | `single_choice`                                                        | Keep and rename conceptually.                          |
| `short_answer`    | Accepted answers                   | `short_answer_en` or `note_completion_en`                              | Keep for English answers. Avoid Russian typed answers. |
| `translation`     | `answerStrategy: text_input`       | `translation_ru_en` or advanced typed Russian                          | Split by direction.                                    |
| `translation`     | `answerStrategy: sentence_builder` | `translation_en_ru_tiles` or `sentence_builder`                        | Promote to first-class interaction.                    |
| `translation`     | `answerStrategy: selection_based`  | `dropdown_gap_fill`, `grammar_form_selection`, or `word_bank_gap_fill` | Promote to first-class interaction.                    |
| `translation`     | `answerStrategy: upload_required`  | `writing_upload`                                                       | Currently placeholder only.                            |

Question-set phase 2 target:

- keep existing records working
- introduce first-class interaction keys
- stop overloading `translation`
- add shared renderers for matching, gap fill, ordering, and categorisation

## Existing Mock Exam Compatibility

Mock exams currently have broader type names. Many are exam-task labels rather
than student interaction types.

| Existing mock type         | Final interaction mapping                                          | Status                                                |
| -------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| `multiple_choice`          | `single_choice`                                                    | Covered.                                              |
| `multiple_response`        | `multi_select`                                                     | Covered.                                              |
| `short_answer`             | `short_answer_en`                                                  | Covered for English; avoid Russian typing.            |
| `gap_fill`                 | `word_bank_gap_fill` or `dropdown_gap_fill`                        | Needs digital-first gap UI.                           |
| `matching`                 | `matching`                                                         | Covered in mock UI; should become shared.             |
| `sequencing`               | `ordering`                                                         | Needs tap/drag ordering, not comma-separated numbers. |
| `opinion_recognition`      | `opinion_recognition`                                              | Covered in mock UI; should become shared.             |
| `true_false_not_mentioned` | `true_false_not_mentioned`                                         | Covered in mock UI; should become shared.             |
| `translation_into_english` | `translation_ru_en`                                                | Needs marking model beyond raw textarea.              |
| `translation_into_russian` | `translation_en_ru_tiles` or `writing_upload`                      | Avoid default Cyrillic typing.                        |
| `writing_task`             | `writing_upload` or `writing_draft_optional`                       | Needs upload workflow and rubric metadata.            |
| `simple_sentences`         | `writing_upload`, `sentence_builder`, or `writing_draft_optional`  | Use scaffolded practice before open writing.          |
| `short_paragraph`          | `writing_upload` or `writing_draft_optional`                       | Needs rubric metadata.                                |
| `extended_writing`         | `writing_upload` or `writing_draft_optional`                       | Needs rubric metadata.                                |
| `role_play`                | `role_play_response`, `speaking_prep_notes`, `speaking_recording`  | Needs speaking workflow.                              |
| `photo_card`               | `photo_card_response`, `speaking_prep_notes`, `speaking_recording` | Needs image + prep + recording workflow.              |
| `conversation`             | `conversation_response`, `speaking_recording`                      | Needs speaking workflow.                              |
| `sentence_builder`         | `sentence_builder`                                                 | Covered conceptually; should use shared renderer.     |
| `note_completion`          | `note_completion_en` or `word_bank_gap_fill`                       | Covered with text inputs; improve with choices.       |
| `listening_comprehension`  | `listening_task` parent + child interactions                       | Needs parent-child task model.                        |
| `reading_comprehension`    | `reading_task` parent + child interactions                         | Needs parent-child task model.                        |
| `other`                    | `manual_marked_response`                                           | Migration-only escape hatch.                          |

## GCSE Coverage Target

The complete question design system should cover:

- multiple choice
- multiple response
- short answer in English
- note completion
- matching
- speaker identification
- true / false / not mentioned
- opinion recognition
- gap fill with selectable answers
- word bank gap fill
- table completion
- sentence ordering
- phrase ordering
- categorisation
- click-word / click-phrase evidence tasks
- translation into English
- translation into Russian with tiles
- grammar form selection
- verb form selection
- error spotting
- sentence transformation with tiles
- reading comprehension parent tasks
- listening comprehension parent tasks
- role play preparation and response
- photo card preparation and response
- conversation preparation and response
- writing task upload
- optional typed drafts

## Data Model Direction

Future questions should support these fields conceptually:

```ts
type FutureQuestionDesignShape = {
  taskContext: string;
  interactionType: string;
  skillKey?: string;
  paperKey?: string;
  paperTaskKey?: string;
  tier?: "foundation" | "higher" | "both";
  studentInputMode: string;
  responseLanguage: "english" | "russian" | "mixed" | "none";
  requiresRussianTyping: boolean;
  stimulus?: {
    kind: "text" | "audio" | "image" | "mixed";
  };
  responseSchema: Record<string, unknown>;
  markingSchema: Record<string, unknown>;
};
```

The exact database design can come later. Phase 1 only establishes the vocabulary.

## Admin Authoring Rules

Admin forms should eventually:

- ask for the interaction type first
- warn when Russian typing would be required
- prefer structured fields over raw JSON
- show a student preview
- provide GCSE templates by skill and paper task
- store mark guidance separately from student-visible content
- support hidden answer keys and model answers safely

## Renderer Rules

Renderers should eventually:

- use shared interaction components across lessons, question sets, mock exams, and assignments
- render by interaction type, not by source system
- support mobile tap-first interactions
- use drag interactions as enhancement, not the only path
- expose audio replay limits for listening tasks
- support reading/listening parent tasks with child questions
- prevent accidental display of hidden answers or transcripts

## Marking Rules

Objective questions can be auto-marked.

Typed English short answers need accepted-answer handling with:

- normalisation
- synonyms/paraphrases
- minor spelling tolerance where meaning is clear
- contradiction handling
- partial credit where appropriate

Writing and speaking should be teacher-marked first, with future AI assistance.

Future AI-assisted marking should store:

- criteria
- level descriptors
- mark scheme reference
- task type
- tier
- word count guidance
- response media references
- model answer or exemplar reference
- teacher override

## Phase Plan

Phase 1:

- define taxonomy
- add compatibility maps
- do not change behaviour

Phase 2:

- add shared renderer components for objective/selective digital interactions
- add structured admin editors for the highest-priority interactions

Phase 3:

- add reading/listening parent task model
- attach child interactions to a shared stimulus

Phase 4:

- add writing upload and speaking recording workflows
- add rubric metadata

Phase 5:

- route mock exams and question sets through one shared engine
- reduce duplicated marking/rendering logic

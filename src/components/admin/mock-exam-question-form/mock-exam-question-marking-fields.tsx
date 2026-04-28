import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import type { MockExamQuestionDataState } from "@/lib/mock-exams/question-data/codecs";
import type { MockExamQuestionType } from "@/lib/mock-exams/types";

import type { MockExamQuestionDataUpdater } from "./mock-exam-question-form-types";
import {
  speakingQuestionTypes,
  writingQuestionTypes,
} from "./mock-exam-question-type-groups";
import TextLinesHint from "./text-lines-hint";

type MockExamQuestionMarkingFieldsProps = {
  questionType: MockExamQuestionType;
  state: MockExamQuestionDataState;
  updateField: MockExamQuestionDataUpdater;
};

export default function MockExamQuestionMarkingFields({
  questionType,
  state,
  updateField,
}: MockExamQuestionMarkingFieldsProps) {
  return (
    <>
      {[...writingQuestionTypes, ...speakingQuestionTypes].includes(questionType) ? (
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Response mode">
              <Select
                value={state.responseMode}
                onChange={(event) => updateField("responseMode", event.target.value)}
              >
                <option value="">Default for type</option>
                <option value="handwriting_upload">Handwriting upload</option>
                <option value="typed_draft_optional">Typed draft optional</option>
                <option value="tile_builder">Tile builder</option>
                <option value="audio_recording">Audio recording</option>
                <option value="teacher_marked_manual">Teacher marked manual</option>
              </Select>
            </FormField>
            <FormField label="Upload required">
              <Select
                value={state.uploadRequired}
                onChange={(event) => updateField("uploadRequired", event.target.value)}
              >
                <option value="">Default</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </FormField>
            <FormField label="Typed draft">
              <Select
                value={state.allowTypedDraft}
                onChange={(event) => updateField("allowTypedDraft", event.target.value)}
              >
                <option value="">Default</option>
                <option value="true">Allow</option>
                <option value="false">Do not allow</option>
              </Select>
            </FormField>
          </div>

          {speakingQuestionTypes.includes(questionType) ? (
            <FormField label="Audio recording">
              <Select
                value={state.allowAudioRecording}
                onChange={(event) =>
                  updateField("allowAudioRecording", event.target.value)
                }
              >
                <option value="">Default</option>
                <option value="true">Allow</option>
                <option value="false">Do not allow</option>
              </Select>
            </FormField>
          ) : null}

          <FormField label="Criteria">
            <Textarea
              rows={4}
              value={state.criteriaText}
              onChange={(event) => updateField("criteriaText", event.target.value)}
              placeholder="Content|How well the response communicates meaning|10"
            />
            <TextLinesHint>
              Use one line per criterion: label|description|marks
            </TextLinesHint>
          </FormField>

          <FormField label="Level descriptors">
            <Textarea
              rows={4}
              value={state.levelDescriptorsText}
              onChange={(event) =>
                updateField("levelDescriptorsText", event.target.value)
              }
              placeholder="Level 3|Generally clear communication with minor errors|"
            />
            <TextLinesHint>
              Use one line per descriptor: label|description|marks
            </TextLinesHint>
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Mark scheme reference">
              <Input
                value={state.markSchemeReference}
                onChange={(event) =>
                  updateField("markSchemeReference", event.target.value)
                }
              />
            </FormField>
            <FormField label="Word count guidance">
              <Input
                value={state.wordCountGuidance}
                onChange={(event) => updateField("wordCountGuidance", event.target.value)}
              />
            </FormField>
          </div>

          <FormField label="AI marking notes">
            <Textarea
              rows={3}
              value={state.aiMarkingNotes}
              onChange={(event) => updateField("aiMarkingNotes", event.target.value)}
              placeholder="Future AI marking constraints, evidence expectations, or teacher override notes."
            />
          </FormField>
        </div>
      ) : null}

      {["gap_fill", "note_completion"].includes(questionType) ? (
        <FormField label={questionType === "gap_fill" ? "Gaps" : "Fields"}>
          <Textarea
            rows={5}
            value={state.fieldsText}
            onChange={(event) => updateField("fieldsText", event.target.value)}
          />
          <TextLinesHint>Use one line per item: prompt|answer1;answer2</TextLinesHint>
        </FormField>
      ) : null}

      <FormField label="Mark guidance">
        <Textarea
          rows={4}
          value={state.markGuidance}
          onChange={(event) => updateField("markGuidance", event.target.value)}
          placeholder="Original mark scheme notes or teacher rubric guidance for this platform mock question."
        />
      </FormField>
    </>
  );
}

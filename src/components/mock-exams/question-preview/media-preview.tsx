import Image from "next/image";
import AudioPlayer from "@/components/questions/audio-player";
import type { DbMockExamQuestion } from "@/lib/mock-exams/mock-exam-helpers-db";
import { getNumber, getString, getTaskStimulus } from "./preview-data";

export function MockExamQuestionMediaPreview({
  question,
}: {
  question: DbMockExamQuestion;
}) {
  const stimulus = getTaskStimulus(question);
  const audioUrl = getString(question.data.audioUrl) || getString(stimulus.audioUrl);
  const imageUrl = getString(question.data.imageUrl) || getString(stimulus.imageUrl);
  const replayLimit =
    getNumber(question.data.audioMaxPlays) ?? getNumber(stimulus.replayLimit);

  if (!audioUrl && !imageUrl) return null;

  return (
    <div className="space-y-3">
      {audioUrl ? (
        <AudioPlayer
          src={audioUrl}
          maxPlays={replayLimit}
          listeningMode={question.question_type === "listening_comprehension"}
        />
      ) : null}

      {imageUrl ? (
        <figure className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-muted)]">
          <Image
            src={imageUrl}
            alt="Mock exam visual prompt"
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 900px"
            unoptimized
            className="max-h-[420px] w-full object-contain"
          />
        </figure>
      ) : null}
    </div>
  );
}

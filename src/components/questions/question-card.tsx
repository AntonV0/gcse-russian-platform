import type { ReactNode } from "react";
import AudioPlayer from "@/components/questions/audio-player";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type QuestionCardProps = {
  heading?: string;
  instruction?: string;
  prompt: string;
  headingLevel?: HeadingLevel;
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
  onAudioPlaybackCompleted?: () => void;
  children: ReactNode;
  feedback?: ReactNode;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function QuestionCard({
  heading = "Question",
  instruction,
  prompt,
  headingLevel = 3,
  audioUrl,
  audioMaxPlays,
  audioListeningMode = false,
  audioAutoPlay = false,
  audioHideNativeControls = false,
  onAudioPlaybackCompleted,
  children,
  feedback,
}: QuestionCardProps) {
  return (
    <section className="dev-marker-host relative app-card app-section-padding space-y-5">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="QuestionCard"
          filePath="src/components/questions/question-card.tsx"
          tier="container"
          componentRole="Shared question shell with prompt, optional audio, answer content, and feedback region"
          bestFor="GCSE Russian practice questions that need consistent prompt, listening audio, response controls, and feedback layout."
          usageExamples={[
            "Multiple-choice practice",
            "Short-answer question",
            "Translation exercise",
            "Listening question card",
          ]}
          notes="Use as the shared question wrapper. Do not use for whole question sets, admin question editing forms, or non-interactive lesson prose."
        />
      ) : null}

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="app-pill app-pill-info">{heading}</span>

            {audioUrl ? (
              <span className="app-pill app-pill-muted">
                {audioListeningMode ? "Listening task" : "Audio available"}
              </span>
            ) : null}
          </div>

          {instruction ? (
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {instruction}
            </p>
          ) : null}

          <Heading level={headingLevel} className="app-question-prompt">
            {prompt}
          </Heading>
        </div>

        {audioUrl ? (
          <AudioPlayer
            src={audioUrl}
            maxPlays={audioMaxPlays}
            listeningMode={audioListeningMode}
            autoPlay={audioAutoPlay}
            hideNativeControls={audioHideNativeControls}
            onPlaybackCompleted={onAudioPlaybackCompleted}
          />
        ) : null}
      </div>

      <div className="space-y-4">{children}</div>

      {feedback ? <div>{feedback}</div> : null}
    </section>
  );
}

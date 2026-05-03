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
    <section className="dev-marker-host relative isolate overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]">
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

      <div className="relative overflow-hidden rounded-[inherit]">
        <div className="space-y-3 p-3.5 md:p-4">
          <div className="sr-only">
            {heading}
            {audioUrl
              ? `, ${audioListeningMode ? "listening task" : "audio available"}`
              : ""}
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-elevated)_88%,var(--background-muted))] px-3 py-2.5">
            {instruction ? (
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                {instruction}
              </p>
            ) : null}

            <Heading level={headingLevel} className="app-question-prompt">
              {prompt}
            </Heading>
          </div>

          {audioUrl ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-elevated)_82%,transparent)] p-3">
              <AudioPlayer
                src={audioUrl}
                maxPlays={audioMaxPlays}
                listeningMode={audioListeningMode}
                autoPlay={audioAutoPlay}
                hideNativeControls={audioHideNativeControls}
                onPlaybackCompleted={onAudioPlaybackCompleted}
              />
            </div>
          ) : null}
        </div>

        <div className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_34%,var(--background-elevated))] p-3.5 md:p-4">
          <div className="space-y-4">{children}</div>
        </div>

        {feedback ? (
          <div className="border-t border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3.5 md:p-4">
            <div>{feedback}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

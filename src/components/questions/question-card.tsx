import type { ReactNode } from "react";
import AudioPlayer from "@/components/questions/audio-player";
import AppIcon from "@/components/ui/app-icon";
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
    <section className="dev-marker-host relative isolate overflow-hidden rounded-3xl border border-[var(--info-border)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]">
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
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_7%,var(--background-elevated))_0%,var(--background-elevated)_58%,color-mix(in_srgb,var(--accent-fill)_5%,var(--background-elevated))_100%)]"
          aria-hidden="true"
        />

        <div className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)] shadow-[0_10px_24px_var(--info-shadow)]">
              <AppIcon icon="exercise" size={19} />
            </span>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="app-pill app-pill-info">{heading}</span>

                {audioUrl ? (
                  <span className="app-pill app-pill-info">
                    {audioListeningMode ? "Listening task" : "Audio available"}
                  </span>
                ) : null}
              </div>

              <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--background-elevated)_88%,transparent)] p-4 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--brand-white)_52%,transparent)]">
                {instruction ? (
                  <p className="mb-2 text-sm font-semibold leading-6 text-[var(--accent-ink)]">
                    {instruction}
                  </p>
                ) : null}

                <Heading level={headingLevel} className="app-question-prompt">
                  {prompt}
                </Heading>
              </div>
            </div>
          </div>

          {audioUrl ? (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-elevated)_82%,transparent)] p-3 shadow-[var(--shadow-xs)]">
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

        <div className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_68%,var(--background-elevated))] p-4 md:p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-[var(--text-muted)]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon="edit" size={14} />
            </span>
            <span>Your response</span>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3 shadow-[var(--shadow-xs)] md:p-4">
            <div className="space-y-4">{children}</div>
          </div>
        </div>

        {feedback ? (
          <div className="border-t border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4 md:p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-[var(--text-muted)]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon="success" size={14} />
              </span>
              <span>Feedback</span>
            </div>

            <div>{feedback}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

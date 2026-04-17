import type { ReactNode } from "react";
import AudioPlayer from "@/components/questions/audio-player";

type QuestionCardProps = {
  heading?: string;
  instruction?: string;
  prompt: string;
  audioUrl?: string | null;
  audioMaxPlays?: number;
  audioListeningMode?: boolean;
  audioAutoPlay?: boolean;
  audioHideNativeControls?: boolean;
  onAudioPlaybackCompleted?: () => void;
  children: ReactNode;
  feedback?: ReactNode;
};

export default function QuestionCard({
  heading = "Question",
  instruction,
  prompt,
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
    <section className="app-card app-section-padding space-y-5">
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

          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{prompt}</h2>
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

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
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{heading}</h2>

          {instruction ? (
            <p className="text-sm font-medium text-gray-600">{instruction}</p>
          ) : null}

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

          <p className="text-gray-800">{prompt}</p>
        </div>

        <div className="space-y-4">{children}</div>

        {feedback ? <div>{feedback}</div> : null}
      </div>
    </section>
  );
}
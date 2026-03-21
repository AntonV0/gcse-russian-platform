"use client";

import { useMemo, useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
  maxPlays?: number;
  listeningMode?: boolean;
};

export default function AudioPlayer({
  src,
  maxPlays,
  listeningMode = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const effectiveMaxPlays =
    typeof maxPlays === "number" && maxPlays > 0 ? maxPlays : undefined;

  const remainingPlays = useMemo(() => {
    if (effectiveMaxPlays === undefined) return null;
    return Math.max(effectiveMaxPlays - playCount, 0);
  }, [effectiveMaxPlays, playCount]);

  async function handlePlayClick() {
    if (!audioRef.current) return;

    if (effectiveMaxPlays !== undefined && playCount >= effectiveMaxPlays) {
      setIsLocked(true);
      return;
    }

    setIsLocked(false);

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setPlayCount((current) => current + 1);
    } catch {
      // Ignore autoplay/playback interruption errors from the browser.
    }
  }

  function handleEnded() {
    if (effectiveMaxPlays !== undefined && playCount >= effectiveMaxPlays) {
      setIsLocked(true);
    }
  }

  const showLockedState =
    effectiveMaxPlays !== undefined && isLocked && playCount >= effectiveMaxPlays;

  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      {listeningMode || effectiveMaxPlays !== undefined ? (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          {listeningMode ? (
            <span className="rounded-full bg-gray-200 px-2 py-1 font-medium">
              Listening task
            </span>
          ) : null}

          {effectiveMaxPlays !== undefined ? (
            <span>
              Plays used: {Math.min(playCount, effectiveMaxPlays)} /{" "}
              {effectiveMaxPlays}
            </span>
          ) : null}

          {remainingPlays !== null ? (
            <span>Remaining: {remainingPlays}</span>
          ) : null}
        </div>
      ) : null}

      {showLockedState ? (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          Playback limit reached for this listening task.
        </div>
      ) : (
        <div className="space-y-3">
          <audio
            ref={audioRef}
            controls
            className="w-full"
            onEnded={handleEnded}
            preload="metadata"
          >
            <source src={src} />
            Your browser does not support the audio element.
          </audio>

          {effectiveMaxPlays !== undefined ? (
            <button
              type="button"
              onClick={handlePlayClick}
              disabled={remainingPlays === 0}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Play audio
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
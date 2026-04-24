"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
  maxPlays?: number;
  listeningMode?: boolean;
  autoPlay?: boolean;
  hideNativeControls?: boolean;
  onPlaybackCompleted?: () => void;
};

export default function AudioPlayer({
  src,
  maxPlays,
  listeningMode = false,
  autoPlay = false,
  hideNativeControls = false,
  onPlaybackCompleted,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAutoPlayedRef = useRef(false);

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
      // Ignore browser playback errors.
    }
  }

  function handleEnded() {
    if (effectiveMaxPlays !== undefined && playCount >= effectiveMaxPlays) {
      setIsLocked(true);
    }

    onPlaybackCompleted?.();
  }

  useEffect(() => {
    if (!autoPlay || hasAutoPlayedRef.current) return;
    if (!audioRef.current) return;
    if (effectiveMaxPlays !== undefined && playCount >= effectiveMaxPlays) return;

    hasAutoPlayedRef.current = true;

    void (async () => {
      try {
        audioRef.current!.currentTime = 0;
        await audioRef.current!.play();
        setPlayCount((current) => current + 1);
      } catch {
        // Browser may block autoplay; user can still press play.
      }
    })();
  }, [autoPlay, effectiveMaxPlays, playCount]);

  const showLockedState =
    effectiveMaxPlays !== undefined && isLocked && playCount >= effectiveMaxPlays;

  const useCustomPlayFlow =
    listeningMode || effectiveMaxPlays !== undefined || hideNativeControls;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
      {listeningMode || effectiveMaxPlays !== undefined ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs app-text-muted">
          {listeningMode ? (
            <span className="app-pill app-pill-muted">Listening task</span>
          ) : null}

          {effectiveMaxPlays !== undefined ? (
            <span>
              Plays used: {Math.min(playCount, effectiveMaxPlays)} / {effectiveMaxPlays}
            </span>
          ) : null}

          {remainingPlays !== null ? <span>Remaining: {remainingPlays}</span> : null}
        </div>
      ) : null}

      {showLockedState ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] p-3 text-sm text-[var(--warning)]">
          Playback limit reached for this listening task.
        </div>
      ) : (
        <div className="space-y-3">
          <audio
            ref={audioRef}
            controls={!useCustomPlayFlow}
            className="w-full"
            onEnded={handleEnded}
            preload="metadata"
          >
            <source src={src} />
            Your browser does not support the audio element.
          </audio>

          {useCustomPlayFlow ? (
            <button
              type="button"
              onClick={handlePlayClick}
              disabled={remainingPlays === 0}
              className="app-btn-base app-btn-secondary rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Play audio
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

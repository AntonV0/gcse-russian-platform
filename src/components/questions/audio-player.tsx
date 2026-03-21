"use client";

type AudioPlayerProps = {
  src: string;
};

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <audio controls className="w-full">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
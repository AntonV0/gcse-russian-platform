"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/button";

type MockExamAudioRecorderProps = {
  questionId: string;
  disabled?: boolean;
};

export default function MockExamAudioRecorder({
  questionId,
  disabled = false,
}: MockExamAudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDataUrl, setAudioDataUrl] = useState("");
  const [recordingError, setRecordingError] = useState<string | null>(null);

  async function startRecording() {
    setRecordingError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const reader = new FileReader();

        reader.onloadend = () => {
          setAudioDataUrl(typeof reader.result === "string" ? reader.result : "");
        };

        reader.readAsDataURL(blob);

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError("Audio recording could not start in this browser.");
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
    setIsRecording(false);
  }

  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
      <input
        type="hidden"
        name={`response_audio_data_${questionId}`}
        value={audioDataUrl}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={isRecording ? "danger" : "secondary"}
          size="sm"
          icon="audio"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          ariaLabel={isRecording ? "Stop recording response" : "Record spoken response"}
        >
          {isRecording ? "Stop recording" : "Record response"}
        </Button>
      </div>

      {audioUrl ? (
        <audio controls src={audioUrl} className="w-full">
          <track kind="captions" />
        </audio>
      ) : null}

      {recordingError ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {recordingError}
        </p>
      ) : null}
    </div>
  );
}

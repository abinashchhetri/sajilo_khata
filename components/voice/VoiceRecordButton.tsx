// ─────────────────────────────────────────────────────────────────────────────
// VoiceRecordButton
// ─────────────────────────────────────────────────────────────────────────────
// Fixed-position mic button. Hold to record; release to fire onTranscriptReady.
// Hides completely (returns null) when SpeechRecognition is not available —
// never a disabled/broken state, just absent.
//
// Touch events:
//   e.preventDefault() on touchstart blocks the browser's long-press context
//   menu and prevents the emulated mousedown that would double-fire on mobile.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { Mic } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHoldToRecord } from "@/hooks/voice/use-hold-to-record.hook";
import VoiceTranscriptOverlay from "@/components/voice/VoiceTranscriptOverlay";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  onTranscriptReady: (transcript: string) => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const VoiceRecordButton = ({ onTranscriptReady }: Props) => {
  const { isSupported, isRecording, transcript, startRecording, stopRecording } =
    useHoldToRecord({ onTranscriptReady });

  if (!isSupported) return null;

  return (
    <>
      <button
        type="button"
        aria-label={
          isRecording ? "Recording — release to confirm" : "Hold to record voice entry"
        }
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center",
          "rounded-full shadow-lg transition-all duration-150 select-none",
          "bg-primary text-primary-foreground",
          isRecording &&
            "scale-110 bg-destructive text-destructive-foreground shadow-destructive/30 shadow-xl",
        )}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={() => {
          if (isRecording) stopRecording();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          startRecording();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          stopRecording();
        }}
      >
        <Mic size={22} className={cn(isRecording && "animate-pulse")} />
      </button>

      {isRecording && <VoiceTranscriptOverlay transcript={transcript} />}
    </>
  );
};

export default VoiceRecordButton;

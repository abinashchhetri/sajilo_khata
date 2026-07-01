// ─────────────────────────────────────────────────────────────────────────────
// useHoldToRecord
// ─────────────────────────────────────────────────────────────────────────────
// Why onTranscriptReady fires in onend, not stopRecording:
//   Chrome's stop() flushes any buffered audio and fires pending onresult
//   events BEFORE firing onend. If we read transcriptRef in stopRecording we
//   race with those final results and almost always get an empty string.
//   Moving the callback to onend (when shouldRestart is false) means we wait
//   for Chrome to finish delivering everything, then hand off the complete text.
//
// Why continuous-restart:
//   Chrome auto-stops SpeechRecognition after ~5 s of silence even with
//   continuous:true. onend restarts immediately while shouldRestartRef is true
//   (user is still holding). Each new session starts clean, so we save the
//   accumulated text in finalizedRef first.
//
// Why refs for transcript state:
//   stopRecording / onend run in DOM event handlers. Reading React state
//   inside a closure captures a stale snapshot from the render it was
//   created in. Plain refs always hold the latest value.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Options {
  onTranscriptReady: (transcript: string) => void;
}

interface HoldToRecordState {
  isSupported: boolean;
  isRecording: boolean;
  transcript: string;
  startRecording: () => void;
  stopRecording: () => void;
}

// SpeechRecognition (the class/interface) is missing from some TypeScript
// DOM lib versions even though SpeechRecognitionEvent/ErrorEvent are present.
// Declare just the instance shape; use the real event types from lib.dom so
// the rec.onresult / rec.onerror assignments stay type-compatible.
interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionCtor = new () => ISpeechRecognition;

const getSpeechRecognitionAPI = (): SpeechRecognitionCtor | undefined =>
  (window as typeof window & { SpeechRecognition?: SpeechRecognitionCtor })
    .SpeechRecognition ??
  (
    window as typeof window & {
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    }
  ).webkitSpeechRecognition;

export const useHoldToRecord = ({
  onTranscriptReady,
}: Options): HoldToRecordState => {
  // false on server so hydration matches; useEffect flips it client-side
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const api = getSpeechRecognitionAPI();
    console.log("[Voice] SpeechRecognition available:", !!api);
    setIsSupported(!!api);
  }, []);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);
  const finalizedRef = useRef(""); // text from completed auto-restart sessions
  const transcriptRef = useRef(""); // always-current full text
  const onReadyRef = useRef(onTranscriptReady);
  useEffect(() => {
    onReadyRef.current = onTranscriptReady;
  }, [onTranscriptReady]);

  const reset = useCallback(() => {
    setTranscript("");
    transcriptRef.current = "";
    finalizedRef.current = "";
    recognitionRef.current = null;
  }, []);

  const buildRecognition = useCallback((): ISpeechRecognition | null => {
    const API = getSpeechRecognitionAPI();
    if (!API) return null;

    const rec = new API();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => console.log("[Voice] recognition started");

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("[Voice] error:", event.error, event.message);
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const sessionText = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      const full = [finalizedRef.current, sessionText]
        .filter(Boolean)
        .join(" ")
        .trim();
      console.log("[Voice] heard:", full);
      setTranscript(full);
      transcriptRef.current = full;
    };

    rec.onend = () => {
      console.log(
        "[Voice] session ended — shouldRestart:",
        shouldRestartRef.current,
        "| transcript so far:",
        transcriptRef.current,
      );

      if (shouldRestartRef.current) {
        // Auto-stopped mid-hold — restart immediately and carry transcript over
        finalizedRef.current = transcriptRef.current;
        const next = buildRecognition();
        if (next) {
          recognitionRef.current = next;
          try {
            next.start();
          } catch {
            // already started — safe to ignore
          }
        }
      } else {
        // User released the button — onend fires after Chrome flushes any
        // remaining onresult events, so transcriptRef is complete here.
        const final = transcriptRef.current.trim();
        setIsRecording(false);
        reset();
        if (final) {
          onReadyRef.current(final);
        }
      }
    };

    return rec;
  }, [reset]);

  const startRecording = useCallback(() => {
    if (!getSpeechRecognitionAPI()) return;

    setTranscript("");
    transcriptRef.current = "";
    finalizedRef.current = "";
    shouldRestartRef.current = true;
    setIsRecording(true);

    const rec = buildRecognition();
    if (!rec) return;
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      // already started — ignore
    }
  }, [buildRecognition]);

  const stopRecording = useCallback(() => {
    // Signal intent — onend will read the final transcript and fire the callback.
    // Do NOT read transcriptRef here: Chrome may still deliver onresult events
    // between stop() and onend, and we'd miss them.
    shouldRestartRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      // already stopped — ignore
    }
  }, []);

  // Stop on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        // already stopped
      }
    };
  }, []);

  return { isSupported, isRecording, transcript, startRecording, stopRecording };
};

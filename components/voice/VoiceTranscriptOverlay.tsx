// ─────────────────────────────────────────────────────────────────────────────
// VoiceTranscriptOverlay
// ─────────────────────────────────────────────────────────────────────────────
// Floating bubble that renders above the mic button while recording is active.
// Extracted from VoiceRecordButton so it can be rendered in a portal or tested
// independently. Receives the live interim transcript as a prop — no state here.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  transcript: string;
}

const VoiceTranscriptOverlay = ({ transcript }: Props) => (
  <div className="fixed bottom-24 right-6 z-40 w-72 rounded-2xl border bg-card p-4 shadow-xl">
    {/* Recording indicator */}
    <div className="mb-2 flex items-center gap-2">
      <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
      <span className="text-xs font-medium text-muted-foreground">
        Listening — release to confirm
      </span>
    </div>

    {/* Live transcript */}
    <p className="min-h-[1.5rem] text-sm leading-relaxed">
      {transcript ? (
        transcript
      ) : (
        <span className="italic text-muted-foreground">Say something…</span>
      )}
    </p>
  </div>
);

export default VoiceTranscriptOverlay;

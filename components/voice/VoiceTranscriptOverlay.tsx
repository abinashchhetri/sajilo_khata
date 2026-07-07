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
  <div className="fixed bottom-40 left-4 right-4 z-50 rounded-2xl border bg-card p-4 shadow-xl sm:left-auto sm:right-6 sm:w-72">
    {/* Format hint */}
    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      Say in this order:
    </p>
    <p className="mb-3 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground">item</span>
      {" → "}
      <span className="font-medium text-foreground">amount</span>
      {", "}
      <span className="font-medium text-foreground">item</span>
      {" → "}
      <span className="font-medium text-foreground">amount</span>
      <br />
      <span className="italic">e.g. &ldquo;dal 100 milk 30 bus 15&rdquo;</span>
    </p>

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

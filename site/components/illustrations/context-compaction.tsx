export function ContextCompaction({ className }: { className?: string }) {
  // Two horizontal stacks compared: compaction (one continuing agent, summary
  // node injected) versus reset (handoff via files into a fresh agent).
  return (
    <svg
      role="img"
      aria-labelledby="cc-title cc-desc"
      viewBox="0 0 720 360"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="cc-title">Compaction versus context reset</title>
      <desc id="cc-desc">
        Two strategies for surviving the context limit. Compaction summarizes
        earlier history in place and continues with the same agent. A context
        reset clears the window entirely; the next agent rebuilds context from
        on-disk handoff artifacts written by the previous one.
      </desc>

      {/* Compaction row */}
      <text
        x="20"
        y="28"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
      >
        Compaction — same agent continues
      </text>

      {/* Turns 1-3, summary, turns 4-5 */}
      {[
        { x: 30, label: "T1" },
        { x: 100, label: "T2" },
        { x: 170, label: "T3" },
      ].map((t) => (
        <g key={`c-${t.label}`} transform={`translate(${t.x}, 50)`}>
          <rect width="56" height="56" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1" />
          <text x="28" y="32" textAnchor="middle" fontSize="11" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fill="currentColor" opacity="0.7">
            {t.label}
          </text>
        </g>
      ))}

      {/* Summary diamond */}
      <g transform="translate(258, 78)">
        <polygon
          points="0,-22 28,0 0,22 -28,0"
          fill="oklch(var(--background))"
          stroke="oklch(var(--accent))"
          strokeWidth="1.5"
        />
        <text textAnchor="middle" y="3" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9" fontWeight="600" fill="oklch(var(--accent))">
          ∑
        </text>
        <text textAnchor="middle" y="36" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9" fill="currentColor" opacity="0.55">
          summary
        </text>
      </g>

      {[
        { x: 320, label: "T4" },
        { x: 390, label: "T5" },
        { x: 460, label: "T6" },
      ].map((t) => (
        <g key={`c2-${t.label}`} transform={`translate(${t.x}, 50)`}>
          <rect width="56" height="56" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1" />
          <text x="28" y="32" textAnchor="middle" fontSize="11" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fill="currentColor" opacity="0.7">
            {t.label}
          </text>
        </g>
      ))}

      <text x="540" y="84" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
        continuity preserved
      </text>
      <text x="540" y="98" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
        context anxiety persists
      </text>

      {/* Divider */}
      <line x1="20" y1="170" x2="700" y2="170" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />

      {/* Reset row */}
      <text
        x="20"
        y="200"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
      >
        Context reset — new agent, handoff via files
      </text>

      {/* Agent A bracket */}
      <g transform="translate(30, 220)">
        <rect width="186" height="80" rx="4" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />
        <text x="8" y="14" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          Agent A
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={20 + i * 50} y="28" width="42" height="42" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1" />
        ))}
      </g>

      {/* Files between */}
      <g transform="translate(248, 250)">
        <rect width="140" height="20" rx="2" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.25" />
        <text x="70" y="14" textAnchor="middle" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize="10" fill="oklch(var(--accent))">
          progress.txt
        </text>

        <rect y="28" width="140" height="20" rx="2" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.25" />
        <text x="70" y="42" textAnchor="middle" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize="10" fill="oklch(var(--accent))">
          features.json
        </text>

        <text x="70" y="74" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9.5" fill="currentColor" opacity="0.55">
          durable handoff
        </text>
      </g>

      {/* Agent B bracket */}
      <g transform="translate(420, 220)">
        <rect width="186" height="80" rx="4" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />
        <text x="8" y="14" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          Agent B (fresh window)
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={20 + i * 50} y="28" width="42" height="42" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1" />
        ))}
      </g>

      <text x="630" y="248" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
        clean slate
      </text>
      <text x="630" y="262" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
        handoff is the cost
      </text>

      {/* Caption */}
      <text x="360" y="338" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10.5" fill="currentColor" opacity="0.55">
        the model determines which one is safer
      </text>
    </svg>
  );
}

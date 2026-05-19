export function HarnessAnatomy({ className }: { className?: string }) {
  // Cutaway showing the six components arranged around a central LLM.
  // E wraps everything (the loop). T sits at the right (the action surface).
  // C and S sit at the top (what the model sees and what survives).
  // L and V sit at the bottom (interception and trajectory capture).
  return (
    <svg
      role="img"
      aria-labelledby="ha-title ha-desc"
      viewBox="0 0 720 380"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="ha-title">Harness anatomy: six components around the model</title>
      <desc id="ha-desc">
        The model sits in the center. The execution loop E wraps everything.
        Context manager C and state store S sit above the model: what the model
        sees and what survives between turns. Tool registry T sits to the
        right: the surface that touches the world. Lifecycle hooks L and the
        evaluation interface V sit below: interception and standardized
        trajectory capture.
      </desc>

      {/* Outer execution loop */}
      <rect
        x="20"
        y="20"
        width="680"
        height="340"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="4 4"
        opacity="0.55"
      />
      <text
        x="40"
        y="44"
        fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        opacity="0.7"
      >
        E — execution loop
      </text>

      {/* Center model node */}
      <g transform="translate(360, 200)">
        <circle r="58" fill="oklch(var(--background))" stroke="oklch(var(--accent))" strokeWidth="1.75" />
        <text
          y="-4"
          textAnchor="middle"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
          fill="oklch(var(--accent))"
        >
          model
        </text>
        <text
          y="14"
          textAnchor="middle"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="10.5"
          fill="currentColor"
          opacity="0.55"
        >
          LLM
        </text>
      </g>

      {/* C — context manager (top-left) */}
      <g transform="translate(150, 80)">
        <rect width="170" height="58" rx="4" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="14" y="22" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize="11" fontWeight="700" fill="currentColor">
          C — context manager
        </text>
        <text x="14" y="40" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10.5" fill="currentColor" opacity="0.6">
          what the model sees
        </text>
        <text x="14" y="52" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.45">
          compaction · retrieval · ordering
        </text>
      </g>

      {/* S — state store (top-right) */}
      <g transform="translate(400, 80)">
        <rect width="170" height="58" rx="4" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="14" y="22" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize="11" fontWeight="700" fill="currentColor">
          S — state store
        </text>
        <text x="14" y="40" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10.5" fill="currentColor" opacity="0.6">
          what survives the turn
        </text>
        <text x="14" y="52" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.45">
          files · git · long-term memory
        </text>
      </g>

      {/* T — tool registry (right) */}
      <g transform="translate(550, 175)">
        <rect width="140" height="58" rx="4" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.5" />
        <text x="14" y="22" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize="11" fontWeight="700" fill="oklch(var(--accent))">
          T — tools
        </text>
        <text x="14" y="40" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10.5" fill="currentColor" opacity="0.6">
          touches the world
        </text>
        <text x="14" y="52" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.45">
          bash · edit · grep · MCP
        </text>
      </g>

      {/* L — lifecycle hooks (bottom-left) */}
      <g transform="translate(150, 270)">
        <rect width="170" height="58" rx="4" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="14" y="22" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize="11" fontWeight="700" fill="currentColor">
          L — lifecycle hooks
        </text>
        <text x="14" y="40" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10.5" fill="currentColor" opacity="0.6">
          intercept every call
        </text>
        <text x="14" y="52" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.45">
          auth · audit · policy
        </text>
      </g>

      {/* V — evaluation interface (bottom-right) */}
      <g transform="translate(400, 270)">
        <rect width="170" height="58" rx="4" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="14" y="22" fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize="11" fontWeight="700" fill="currentColor">
          V — evaluation
        </text>
        <text x="14" y="40" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10.5" fill="currentColor" opacity="0.6">
          structured trajectories
        </text>
        <text x="14" y="52" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.45">
          for downstream judges
        </text>
      </g>

      {/* Connectors from center to each box */}
      <g stroke="currentColor" strokeWidth="0.9" opacity="0.35" fill="none">
        <line x1="320" y1="170" x2="262" y2="138" />
        <line x1="400" y1="170" x2="458" y2="138" />
        <line x1="418" y1="200" x2="550" y2="200" stroke="oklch(var(--accent))" opacity="0.55" />
        <line x1="320" y1="230" x2="262" y2="270" />
        <line x1="400" y1="230" x2="458" y2="270" />
      </g>
    </svg>
  );
}

export function FailureModesGrid({ className }: { className?: string }) {
  // 2 rows x 3 cols. Each cell pairs one component with its failure mode.
  const cells = [
    { letter: "E", name: "execution loop", failure: "execution runaway", x: 0, y: 0 },
    { letter: "T", name: "tool registry", failure: "tool misuse", x: 1, y: 0 },
    { letter: "C", name: "context manager", failure: "context blowout", x: 2, y: 0 },
    { letter: "S", name: "state store", failure: "state loss", x: 0, y: 1 },
    { letter: "L", name: "lifecycle hooks", failure: "unmonitored side effects", x: 1, y: 1 },
    { letter: "V", name: "evaluation", failure: "unobservable behavior", x: 2, y: 1 },
  ];

  const cellW = 220;
  const cellH = 120;
  const gap = 14;

  return (
    <svg
      role="img"
      aria-labelledby="fmg-title fmg-desc"
      viewBox={`0 0 ${cellW * 3 + gap * 2 + 20} ${cellH * 2 + gap + 20}`}
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="fmg-title">Six components, six failure modes</title>
      <desc id="fmg-desc">
        A 2 by 3 grid pairing each of the six harness components with its
        principal failure mode. Execution loop with execution runaway, tool
        registry with tool misuse, context manager with context blowout, state
        store with state loss, lifecycle hooks with unmonitored side effects,
        and evaluation interface with unobservable behavior.
      </desc>

      {cells.map((c) => {
        const tx = 10 + c.x * (cellW + gap);
        const ty = 10 + c.y * (cellH + gap);
        return (
          <g key={c.letter} transform={`translate(${tx}, ${ty})`}>
            <rect width={cellW} height={cellH} rx="6" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1" />

            {/* Component letter */}
            <g transform="translate(20, 22)">
              <circle r="16" fill="oklch(var(--background))" stroke="oklch(var(--accent))" strokeWidth="1.5" />
              <text
                textAnchor="middle"
                y="5"
                fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
                fontSize="14"
                fontWeight="700"
                fill="oklch(var(--accent))"
              >
                {c.letter}
              </text>
            </g>

            <text x="48" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor">
              {c.name}
            </text>
            <text x="48" y="36" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9.5" fill="currentColor" opacity="0.55">
              component
            </text>

            {/* Divider */}
            <line x1="20" y1="56" x2={cellW - 20} y2="56" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />

            <text x="20" y="78" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9.5" fill="currentColor" opacity="0.55">
              failure mode
            </text>
            <text x="20" y="98" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="currentColor">
              {c.failure}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

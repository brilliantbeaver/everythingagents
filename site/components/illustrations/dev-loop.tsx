export function DevLoop({ className }: { className?: string }) {
  const stage = (x: number, y: number, label: string) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width="92"
        height="36"
        rx="3"
        fill="oklch(var(--muted))"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <text
        x="46"
        y="22"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
        fontWeight="500"
        fill="currentColor"
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );

  const arrow = (x: number, y: number, L: number) => (
    <g>
      <line x1={x} y1={y} x2={x + L - 6} y2={y} stroke="currentColor" strokeWidth="1.25" />
      <polygon
        points={`${x + L - 8},${y - 4} ${x + L},${y} ${x + L - 8},${y + 4}`}
        fill="currentColor"
        opacity="0.7"
      />
    </g>
  );

  return (
    <svg
      role="img"
      aria-labelledby="dl-title dl-desc"
      viewBox="0 0 720 200"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="dl-title">The dev loop and the ship path</title>
      <desc id="dl-desc">
        The inner loop runs Edit, Validate, Deploy, Preview, Trace. If the
        trace shows a bug, return to Edit. When the trace is green, exit to
        Ship and Activate.
      </desc>

      <text x="40" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.06em">
        INNER LOOP
      </text>

      {stage(40, 60, "Edit")}
      {arrow(132, 78, 28)}
      {stage(160, 60, "Validate")}
      {arrow(252, 78, 28)}
      {stage(280, 60, "Deploy")}
      {arrow(372, 78, 28)}
      {stage(400, 60, "Preview")}
      {arrow(492, 78, 28)}
      {stage(520, 60, "Trace")}

      <g>
        <path
          d="M 566 60 Q 566 24 446 24 Q 86 24 86 60"
          fill="none"
          stroke="oklch(var(--accent))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polygon points="82,56 86,64 90,56" fill="oklch(var(--accent))" />
        <text
          x="326"
          y="18"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="11"
          fontWeight="500"
          fill="oklch(var(--accent))"
          textAnchor="middle"
        >
          bug found · back to Edit
        </text>
      </g>

      <line x1="612" y1="50" x2="612" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="3 4" />

      <text x="624" y="50" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.06em">
        GREEN
      </text>

      <path d="M 612 78 Q 640 78 640 120" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <polygon points="636,118 640,126 644,118" fill="currentColor" opacity="0.7" />

      {stage(594, 124, "Ship")}

      <g transform="translate(594, 168)">
        <rect width="92" height="24" rx="3" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.25" />
        <text
          x="46"
          y="16"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="11"
          fontWeight="500"
          fill="oklch(var(--accent))"
          textAnchor="middle"
        >
          Activate
        </text>
      </g>

      <line x1="640" y1="160" x2="640" y2="166" stroke="currentColor" strokeWidth="1.25" />
      <polygon points="636,164 640,170 644,164" fill="currentColor" opacity="0.7" />

      <text x="40" y="174" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.55">
        Each iteration is small. Don't ship while still iterating.
      </text>
    </svg>
  );
}

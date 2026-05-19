export function TurnLoop({ className }: { className?: string }) {
  // Four-phase turn loop: observe -> think -> act -> commit -> back to observe.
  // Think is the LLM-driven phase (accent). The other three are deterministic.
  const phases = [
    { x: 130, y: 100, title: "observe", sub: "read state, compose prompt" },
    { x: 360, y: 60, title: "think", sub: "model picks tool or reply", accent: true },
    { x: 590, y: 100, title: "act", sub: "dispatch tool, capture result" },
    { x: 360, y: 240, title: "commit", sub: "write state, log, evaluate" },
  ];

  return (
    <svg
      role="img"
      aria-labelledby="tl-title tl-desc"
      viewBox="0 0 720 320"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="tl-title">One harness turn — four phases</title>
      <desc id="tl-desc">
        A turn cycles through four phases. Observe reads state and composes
        the prompt. Think is the model phase, where it picks a tool or a
        reply. Act dispatches the tool and captures the result. Commit writes
        state, logs, and trajectory before the loop returns to observe.
      </desc>

      {/* Background loop */}
      <ellipse
        cx="360"
        cy="160"
        rx="270"
        ry="115"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.35"
      />

      {phases.map((p) => {
        const stroke = p.accent ? "oklch(var(--accent))" : "currentColor";
        const fill = p.accent ? "oklch(var(--background))" : "oklch(var(--muted))";
        const titleFill = p.accent ? "oklch(var(--accent))" : "currentColor";
        return (
          <g key={p.title} transform={`translate(${p.x - 70}, ${p.y - 26})`}>
            <rect width="140" height="52" rx="4" fill={fill} stroke={stroke} strokeWidth={p.accent ? 1.75 : 1.25} />
            <text
              x="70"
              y="22"
              textAnchor="middle"
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill={titleFill}
            >
              {p.title}
            </text>
            <text
              x="70"
              y="40"
              textAnchor="middle"
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="10"
              fill="currentColor"
              opacity="0.55"
            >
              {p.sub}
            </text>
          </g>
        );
      })}

      {/* Arrowheads */}
      <defs>
        <marker id="tl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.55" />
        </marker>
      </defs>

      <g stroke="currentColor" strokeWidth="1.1" opacity="0.55" fill="none" markerEnd="url(#tl-arrow)">
        <path d="M196,86 Q260,52 296,52" />
        <path d="M424,52 Q500,72 530,86" />
        <path d="M580,138 Q500,210 430,236" />
        <path d="M290,236 Q200,210 178,138" />
      </g>

      {/* Caption strip */}
      <text
        x="360"
        y="298"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10.5"
        fill="currentColor"
        opacity="0.55"
      >
        deterministic shell · soft model core · deterministic shell
      </text>
    </svg>
  );
}

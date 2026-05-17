export function TurnPipeline({ className }: { className?: string }) {
  // Six stages, evenly distributed across the 720-wide canvas.
  // Stages 1-2 deterministic, stage 3 LLM (accent), stage 4 action call,
  // stages 5-6 deterministic again. The shell-around-soft-core shape is
  // reinforced by the banding labels below the row.
  const stages: { x: number; title: string; sub: string; mono?: boolean; accent?: boolean }[] = [
    { x: 24,  title: "instructions",    sub: "if branches" },
    { x: 140, title: "enabled tools",   sub: "available when" },
    { x: 256, title: "LLM picks",       sub: "tool or reply", accent: true },
    { x: 372, title: "action runs",     sub: "set fires" },
    { x: 488, title: "after_reasoning", sub: "deterministic", mono: true },
    { x: 604, title: "reply",           sub: "Inform" },
  ];

  const stageW = 92;
  const stageH = 44;
  const stageY = 30;
  const cy = stageY + stageH / 2; // 52

  return (
    <svg
      role="img"
      aria-labelledby="tp-title tp-desc"
      viewBox="0 0 720 160"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="tp-title">Anatomy of a planner turn</title>
      <desc id="tp-desc">
        A horizontal pipeline of six stages inside one planner turn.
        Instructions resolve and enabled tools are computed deterministically.
        The LLM then picks a tool or reply. The chosen action runs and set
        clauses fire. after_reasoning runs deterministically before the
        assistant reply. The deterministic stages form a hard shell around
        the soft LLM core.
      </desc>

      {stages.map((s, i) => {
        const stroke = s.accent ? "oklch(var(--accent))" : "currentColor";
        const strokeWidth = s.accent ? 1.75 : 1.25;
        const fill = s.accent ? "none" : "oklch(var(--muted))";
        const titleFill = s.accent ? "oklch(var(--accent))" : "currentColor";
        return (
          <g key={i}>
            <rect
              x={s.x}
              y={stageY}
              width={stageW}
              height={stageH}
              rx="3"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            <text
              x={s.x + stageW / 2}
              y={cy - 3}
              fontFamily={
                s.mono
                  ? "var(--font-jetbrains-mono), ui-monospace, monospace"
                  : "var(--font-inter), system-ui, sans-serif"
              }
              fontSize={s.mono ? "10.5" : "11.5"}
              fontWeight="600"
              fill={titleFill}
              textAnchor="middle"
            >
              {s.title}
            </text>
            <text
              x={s.x + stageW / 2}
              y={cy + 12}
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="9.5"
              fill="currentColor"
              opacity="0.55"
              textAnchor="middle"
            >
              {s.sub}
            </text>
          </g>
        );
      })}

      {stages.slice(0, -1).map((s, i) => {
        const next = stages[i + 1];
        const x1 = s.x + stageW + 3;
        const x2 = next.x - 3;
        const mid = (x1 + x2) / 2;
        const involvesAccent = s.accent || next.accent;
        const stroke = involvesAccent ? "oklch(var(--accent))" : "currentColor";
        const opacity = involvesAccent ? 0.9 : 0.7;
        return (
          <g key={`c${i}`}>
            <line
              x1={x1}
              y1={cy}
              x2={x2 - 4}
              y2={cy}
              stroke={stroke}
              strokeWidth="1.25"
              opacity={opacity}
            />
            <polygon
              points={`${x2 - 6},${cy - 4} ${x2},${cy} ${x2 - 6},${cy + 4}`}
              fill={stroke}
              opacity={opacity}
            />
            <line
              x1={mid}
              y1={cy - 2}
              x2={mid}
              y2={cy + 2}
              stroke={stroke}
              strokeWidth="0.75"
              opacity={opacity * 0.4}
            />
          </g>
        );
      })}

      {/* Band 1: deterministic (stages 1-2) */}
      <line
        x1={stages[0].x}
        y1="100"
        x2={stages[1].x + stageW}
        y2="100"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <line x1={stages[0].x} y1="96" x2={stages[0].x} y2="104" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1={stages[1].x + stageW} y1="96" x2={stages[1].x + stageW} y2="104" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <text
        x={(stages[0].x + stages[1].x + stageW) / 2}
        y="118"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        opacity="0.55"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        DETERMINISTIC
      </text>
      <text
        x={(stages[0].x + stages[1].x + stageW) / 2}
        y="133"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        opacity="0.5"
        textAnchor="middle"
      >
        gates compute first
      </text>

      {/* Band 2: LLM (stage 3) */}
      <line
        x1={stages[2].x}
        y1="100"
        x2={stages[2].x + stageW}
        y2="100"
        stroke="oklch(var(--accent))"
        strokeWidth="1.25"
        opacity="0.85"
      />
      <line x1={stages[2].x} y1="96" x2={stages[2].x} y2="104" stroke="oklch(var(--accent))" strokeWidth="1.25" opacity="0.85" />
      <line x1={stages[2].x + stageW} y1="96" x2={stages[2].x + stageW} y2="104" stroke="oklch(var(--accent))" strokeWidth="1.25" opacity="0.85" />
      <text
        x={stages[2].x + stageW / 2}
        y="118"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="oklch(var(--accent))"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        LLM
      </text>
      <text
        x={stages[2].x + stageW / 2}
        y="133"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="oklch(var(--accent))"
        opacity="0.75"
        textAnchor="middle"
      >
        soft core
      </text>

      {/* Band 3: deterministic (stages 4-6) */}
      <line
        x1={stages[3].x}
        y1="100"
        x2={stages[5].x + stageW}
        y2="100"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <line x1={stages[3].x} y1="96" x2={stages[3].x} y2="104" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1={stages[5].x + stageW} y1="96" x2={stages[5].x + stageW} y2="104" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <text
        x={(stages[3].x + stages[5].x + stageW) / 2}
        y="118"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        opacity="0.55"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        DETERMINISTIC
      </text>
      <text
        x={(stages[3].x + stages[5].x + stageW) / 2}
        y="133"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        opacity="0.5"
        textAnchor="middle"
      >
        capture, enforce, reply
      </text>

      <text
        x="24"
        y="18"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        opacity="0.55"
        letterSpacing="0.06em"
      >
        ONE PLANNER TURN
      </text>
      <text
        x="696"
        y="18"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        opacity="0.5"
        textAnchor="end"
      >
        user message → assistant reply
      </text>
    </svg>
  );
}

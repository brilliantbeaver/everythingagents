export function TraceTimeline({ className }: { className?: string }) {
  const steps = [
    {
      name: "UserInputStep",
      subtitle: "what the user actually typed",
      accent: false,
      sideNote: null as string | null,
    },
    {
      name: "NodeEntryStateStep",
      subtitle: "which subagent the planner picked",
      accent: false,
      sideNote: null,
    },
    {
      name: "VariableUpdateStep",
      subtitle: "instructions resolve",
      accent: false,
      sideNote: null,
    },
    {
      name: "EnabledToolsStep",
      subtitle: "which actions this turn could use",
      accent: true,
      sideNote: "what the LLM saw",
    },
    {
      name: "LLMStep",
      subtitle: "the model's choice for this turn",
      accent: true,
      sideNote: "what the LLM picked",
    },
    {
      name: "VariableUpdateStep",
      subtitle: "set clauses fire (post-action)",
      accent: false,
      sideNote: null,
    },
    {
      name: "PlannerResponseStep",
      subtitle: "reply to the user",
      accent: false,
      sideNote: null,
    },
  ];

  const railX = 80;
  const topY = 60;
  const stepGap = 38;
  const bottomY = topY + stepGap * (steps.length - 1);

  return (
    <svg
      role="img"
      aria-labelledby="tt-title tt-desc"
      viewBox="0 0 540 360"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="tt-title">The shape of one trace, in order</title>
      <desc id="tt-desc">
        A vertical timeline of the seven trace step types written for a
        single planner turn. EnabledToolsStep and LLMStep are highlighted:
        together they show what the LLM saw and what it picked.
      </desc>

      <text
        x="80"
        y="32"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        opacity="0.55"
        letterSpacing="0.08em"
      >
        TRACE STEP TIMELINE
      </text>

      <line
        x1={railX}
        y1={topY - 12}
        x2={railX}
        y2={bottomY + 12}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />

      {steps.map((step, i) => {
        const y = topY + i * stepGap;
        const stroke = step.accent ? "oklch(var(--accent))" : "currentColor";
        const strokeWidth = step.accent ? 1.5 : 1;
        const tickFill = step.accent ? "oklch(var(--accent))" : "oklch(var(--background))";
        const nameFill = step.accent ? "oklch(var(--accent))" : "currentColor";
        const nameWeight = step.accent ? 700 : 600;

        return (
          <g key={i}>
            <line
              x1={railX - 6}
              y1={y}
              x2={railX + 6}
              y2={y}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <circle
              cx={railX}
              cy={y}
              r={step.accent ? 4 : 3}
              fill={tickFill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            <text
              x={railX + 18}
              y={y - 2}
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize="12"
              fontWeight={nameWeight}
              fill={nameFill}
            >
              {step.name}
            </text>
            <text
              x={railX + 18}
              y={y + 13}
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="10"
              fill="currentColor"
              opacity="0.55"
            >
              {step.subtitle}
            </text>

            {step.sideNote ? (
              <g>
                <line
                  x1={380}
                  y1={y}
                  x2={400}
                  y2={y}
                  stroke="oklch(var(--accent))"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text
                  x={406}
                  y={y + 3}
                  fontFamily="var(--font-inter), system-ui, sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  fill="oklch(var(--accent))"
                  letterSpacing="0.02em"
                >
                  {step.sideNote}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

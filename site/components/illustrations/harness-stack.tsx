export function HarnessStack({ className }: { className?: string }) {
  // Layers from top (user-facing) down to model. Each layer labels what
  // a Claude Code user actually touches at that layer.
  const layers = [
    {
      title: "you",
      sub: "prompt · feedback · approval",
      mono: false,
    },
    {
      title: "natural-language harness",
      sub: "CLAUDE.md · skills · AGENTS.md",
      mono: true,
      accent: true,
    },
    {
      title: "harness runtime",
      sub: "loop · tools · context · state · hooks · trace",
      mono: false,
    },
    {
      title: "tool implementations",
      sub: "bash · edit · grep · MCP servers",
      mono: true,
    },
    {
      title: "model",
      sub: "Claude / Opus / Sonnet / Haiku",
      mono: false,
    },
  ];

  const w = 520;
  const h = 56;
  const gap = 8;
  const x = 100;
  const totalH = layers.length * (h + gap) - gap;

  return (
    <svg
      role="img"
      aria-labelledby="hs-title hs-desc"
      viewBox={`0 0 720 ${totalH + 40}`}
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="hs-title">The layers of a coding-agent harness</title>
      <desc id="hs-desc">
        From top to bottom: you, the natural-language harness layer that you
        actually edit, the harness runtime, the tool implementations, and the
        model. Most users only ever touch the second layer; the runtime is
        provided by the agent product.
      </desc>

      {layers.map((l, i) => {
        const ty = 20 + i * (h + gap);
        const stroke = l.accent ? "oklch(var(--accent))" : "currentColor";
        const fill = l.accent ? "oklch(var(--background))" : "oklch(var(--muted))";
        const titleFill = l.accent ? "oklch(var(--accent))" : "currentColor";
        return (
          <g key={l.title} transform={`translate(${x}, ${ty})`}>
            <rect width={w} height={h} rx="4" fill={fill} stroke={stroke} strokeWidth={l.accent ? 1.5 : 1} />
            <text
              x="20"
              y="24"
              fontFamily={l.mono ? "var(--font-jetbrains-mono), ui-monospace, monospace" : "var(--font-inter), system-ui, sans-serif"}
              fontSize="13"
              fontWeight="600"
              fill={titleFill}
            >
              {l.title}
            </text>
            <text
              x="20"
              y="42"
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="10.5"
              fill="currentColor"
              opacity="0.55"
            >
              {l.sub}
            </text>
          </g>
        );
      })}

      {/* "you edit" indicator on layer 2 */}
      <g transform={`translate(${x + w + 12}, ${20 + 1 * (h + gap) + 18})`}>
        <text
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="10"
          fontWeight="600"
          fill="oklch(var(--accent))"
        >
          ← you edit this layer
        </text>
      </g>

      {/* "vendor-controlled" bracket on layers 3-5 */}
      <g>
        <line
          x1={x - 14}
          y1={20 + 2 * (h + gap)}
          x2={x - 14}
          y2={20 + 5 * (h + gap) - gap}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <text
          transform={`translate(${x - 24}, ${20 + 3.5 * (h + gap) - h / 2}) rotate(-90)`}
          textAnchor="middle"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="9.5"
          fill="currentColor"
          opacity="0.55"
        >
          vendor-controlled
        </text>
      </g>
    </svg>
  );
}

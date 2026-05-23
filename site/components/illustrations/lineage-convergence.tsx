export function LineageConvergence({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-labelledby="lc-title lc-desc"
      viewBox="0 0 720 320"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="lc-title">Where Agent Script sits in AI research</title>
      <desc id="lc-desc">
        Four overlapping ellipses representing four research lineages:
        neuro-symbolic AI (Kautz, Garcez and Lamb), ReAct and tool use
        (Yao, Schick), constrained generation (Willard and Louf, Park),
        and cognitive architectures (CoALA / Sumers et al.). Agent
        Script sits at the central intersection where all four overlap.
        It is defined by the convergence, not downstream of it.
      </desc>

      {/* Four overlapping ellipses, 2x2 cluster centered on (360, 160) */}
      <ellipse
        cx="305"
        cy="135"
        rx="170"
        ry="90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.55"
      />
      <ellipse
        cx="415"
        cy="135"
        rx="170"
        ry="90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.55"
      />
      <ellipse
        cx="305"
        cy="185"
        rx="170"
        ry="90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.55"
      />
      <ellipse
        cx="415"
        cy="185"
        rx="170"
        ry="90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.55"
      />

      {/* Central intersection wash */}
      <ellipse
        cx="360"
        cy="160"
        rx="58"
        ry="34"
        fill="oklch(var(--accent))"
        fillOpacity="0.18"
      />

      {/* Agent Script label inside the intersection */}
      <text
        x="360"
        y="164"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="14"
        fontWeight="600"
        fill="oklch(var(--accent))"
        textAnchor="middle"
      >
        Agent Script
      </text>

      {/* Top-left lineage label: above and to the left of TL ellipse */}
      <text
        x="60"
        y="40"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
        textAnchor="start"
      >
        Neuro-symbolic AI
      </text>
      <text
        x="60"
        y="56"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        textAnchor="start"
        opacity="0.55"
        letterSpacing="0.04em"
      >
        KAUTZ, GARCEZ &amp; LAMB
      </text>

      {/* Top-right lineage label */}
      <text
        x="660"
        y="40"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
        textAnchor="end"
      >
        ReAct + tool use
      </text>
      <text
        x="660"
        y="56"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        textAnchor="end"
        opacity="0.55"
        letterSpacing="0.04em"
      >
        YAO, SCHICK
      </text>

      {/* Bottom-left lineage label */}
      <text
        x="60"
        y="288"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
        textAnchor="start"
      >
        Constrained generation
      </text>
      <text
        x="60"
        y="304"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        textAnchor="start"
        opacity="0.55"
        letterSpacing="0.04em"
      >
        WILLARD &amp; LOUF, PARK
      </text>

      {/* Bottom-right lineage label */}
      <text
        x="660"
        y="288"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
        textAnchor="end"
      >
        Cognitive architectures
      </text>
      <text
        x="660"
        y="304"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        textAnchor="end"
        opacity="0.55"
        letterSpacing="0.04em"
      >
        COALA / SUMERS ET AL.
      </text>
    </svg>
  );
}

export function ControlSurfaceStack({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-labelledby="cs-title cs-desc"
      viewBox="0 0 540 320"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="cs-title">The four control surfaces, stacked</title>
      <desc id="cs-desc">
        Four layers stacked from coarse to fine. Topic boundaries set the
        scope. Reasoning instructions guide the LLM. Available-when gates
        decide what tools the LLM sees. After-reasoning blocks compute
        derived state once an action runs.
      </desc>

      <g transform="translate(60, 30)">
        <rect width="380" height="48" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="20" y="20" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="currentColor">
          Topic / subagent boundaries
        </text>
        <text x="20" y="36" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.6">
          which set of actions and instructions is active
        </text>
      </g>

      <g transform="translate(60, 96)">
        <rect width="380" height="48" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.5" />
        <text x="20" y="20" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="currentColor">
          reasoning.instructions:
        </text>
        <text x="20" y="36" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.6">
          the per-turn prompt the LLM sees
        </text>
      </g>

      <g transform="translate(60, 162)">
        <rect width="380" height="48" rx="3" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.75" />
        <text x="20" y="20" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="oklch(var(--accent))">
          available when ‹expr›
        </text>
        <text x="20" y="36" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.6">
          which actions the LLM can even see
        </text>
        <g transform="translate(348, 16)">
          <rect x="0" y="6" width="18" height="14" rx="2" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.5" />
          <path d="M3 6 V3 a6 6 0 0 1 12 0 V6" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.5" />
        </g>
      </g>

      <g transform="translate(60, 228)">
        <rect width="380" height="48" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.5" />
        <text x="20" y="20" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="currentColor">
          after_reasoning:
        </text>
        <text x="20" y="36" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.6">
          deterministic variable updates after an action runs
        </text>
      </g>

      <g transform="translate(470, 30)">
        <line x1="6" y1="0" x2="6" y2="246" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="2" y1="0" x2="10" y2="0" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="2" y1="246" x2="10" y2="246" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <text x="22" y="6" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.05em">COARSE</text>
        <text x="22" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.5">LLM-driven</text>
        <text x="22" y="246" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.05em">FINE</text>
        <text x="22" y="262" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.5">deterministic</text>
      </g>

      <text x="270" y="305" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.55">
        soft above, hard below. Pick the lowest layer that gets the job done.
      </text>
    </svg>
  );
}

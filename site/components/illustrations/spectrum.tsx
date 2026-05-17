export function SpectrumIllustration({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-labelledby="spectrum-title spectrum-desc"
      viewBox="0 0 720 190"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="spectrum-title">The spectrum of agent control</title>
      <desc id="spectrum-desc">
        Agents fall on a horizontal axis from free-roam, where the language
        model picks every action, to fully scripted, where every transition
        is a deterministic gate. The refund agent in this tutorial sits in
        the middle: guided determinism.
      </desc>

      <line x1="60" y1="120" x2="660" y2="120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="110" x2="60" y2="130" stroke="currentColor" strokeWidth="1.5" />
      <line x1="660" y1="110" x2="660" y2="130" stroke="currentColor" strokeWidth="1.5" />
      <line x1="360" y1="113" x2="360" y2="127" stroke="currentColor" strokeWidth="1" opacity="0.5" />

      <text x="60" y="155" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" opacity="0.55" textAnchor="start" letterSpacing="0.05em">FREE-ROAM</text>
      <text x="60" y="172" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.5" textAnchor="start">LLM picks every action</text>
      <text x="660" y="155" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" opacity="0.55" textAnchor="end" letterSpacing="0.05em">FULLY SCRIPTED</text>
      <text x="660" y="172" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.5" textAnchor="end">every transition is a gate</text>

      <g transform="translate(140, 120)">
        <circle r="5" fill="oklch(var(--background))" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="-10" x2="0" y2="-44" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <text x="0" y="-50" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="12" fill="currentColor" textAnchor="middle" opacity="0.85">chatbot</text>
        <text x="0" y="-66" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" textAnchor="middle" opacity="0.5">Ralph Wiggum loop</text>
      </g>

      <g transform="translate(360, 120)">
        <circle r="14" fill="none" stroke="oklch(var(--accent))" strokeWidth="1" opacity="0.25" />
        <circle r="9" fill="none" stroke="oklch(var(--accent))" strokeWidth="1" opacity="0.5" />
        <circle r="5" fill="oklch(var(--accent))" stroke="oklch(var(--accent))" strokeWidth="1.5" />
        <line x1="0" y1="-18" x2="0" y2="-50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <text x="0" y="-56" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="currentColor" textAnchor="middle">guided determinism</text>
        <text x="0" y="-72" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="oklch(var(--accent))" textAnchor="middle">reliable agent</text>
      </g>

      <g transform="translate(580, 120)">
        <circle r="5" fill="oklch(var(--background))" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="-10" x2="0" y2="-44" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <text x="0" y="-50" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="12" fill="currentColor" textAnchor="middle" opacity="0.85">IVR / form flow</text>
        <text x="0" y="-66" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" textAnchor="middle" opacity="0.5">no LLM</text>
      </g>

    </svg>
  );
}

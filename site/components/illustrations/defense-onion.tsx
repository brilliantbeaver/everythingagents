export function DefenseOnion({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-labelledby="do-title do-desc"
      viewBox="0 0 640 380"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="do-title">Defense in depth</title>
      <desc id="do-desc">
        Four concentric layers between the language model's narration and the
        truth Apex actually produced. From outside in: schema descriptions,
        flag-based gates, server-issued nonces, and re-fetch on the next
        action.
      </desc>

      <g transform="translate(320, 200)">
        <circle r="170" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
        <text x="0" y="-150" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" textAnchor="middle" opacity="0.75">A · schema descriptions</text>

        <circle r="130" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <text x="0" y="-110" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" textAnchor="middle" opacity="0.85">B · flag-based gates</text>

        <circle r="90" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.5" opacity="0.6" />
        <text x="0" y="-70" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="oklch(var(--accent))" textAnchor="middle" opacity="0.9">C · server-issued nonces</text>

        <circle r="50" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.75" />
        <text x="0" y="-30" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="oklch(var(--accent))" textAnchor="middle">D · re-fetch on next action</text>

        <circle r="20" fill="oklch(var(--accent))" />
        <text x="0" y="3" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fontWeight="600" fill="oklch(var(--accent-foreground))" textAnchor="middle" letterSpacing="0.05em">TRUTH</text>
      </g>

      {/* Left-side annotation: where this picture starts (LLM narration) */}
      <g transform="translate(30, 196)">
        <text x="0" y="0" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.05em">LLM-SIDE</text>
        <text x="0" y="16" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">narration enters</text>
      </g>
      {/* Arrow inward into outer ring */}
      <line x1="118" y1="200" x2="148" y2="200" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.55" />
      <polygon points="146,196 154,200 146,204" fill="currentColor" opacity="0.55" />

      {/* Right-side gradient axis: weaker (outside) to stronger (inside) */}
      <g transform="translate(540, 80)">
        {/* Vertical axis line */}
        <line x1="0" y1="0" x2="0" y2="240" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        {/* End markers */}
        <line x1="-4" y1="0" x2="4" y2="0" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="-4" y1="240" x2="4" y2="240" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        {/* Top label (weaker) */}
        <text x="12" y="6" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.05em">OUTER</text>
        <text x="12" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">cheap, weaker</text>
        <text x="12" y="36" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.5">spoofable</text>
        {/* Bottom label (stronger) */}
        <text x="12" y="226" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fontWeight="600" fill="oklch(var(--accent))" letterSpacing="0.05em">INNER</text>
        <text x="12" y="242" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.65">server-enforced</text>
        <text x="12" y="256" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.5">hard to fake</text>
      </g>

      <text x="320" y="370" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.55">
        outer layers narrow what reaches inner layers; inner layers are enforced by Apex
      </text>
    </svg>
  );
}

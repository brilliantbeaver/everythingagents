export function TwoFailureModes({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-labelledby="tfm-title tfm-desc"
      viewBox="0 0 720 220"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="tfm-title">Two failure modes</title>
      <desc id="tfm-desc">
        On the left: a prompt-only agent loops on itself, narrating instead
        of acting. On the right: a fully scripted agent runs three rigid
        steps and breaks the moment input falls off-script.
      </desc>

      <line x1="360" y1="20" x2="360" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.25" />

      <text x="40" y="32" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.06em">
        FAILURE MODE A · PROMPT-ONLY
      </text>

      <g>
        <rect x="40" y="60" width="170" height="34" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="125" y="82" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle">
          LLM picks what to say
        </text>

        <line x1="125" y1="94" x2="125" y2="106" stroke="currentColor" strokeWidth="1.25" />
        <polygon points="121,103 125,111 129,103" fill="currentColor" opacity="0.7" />

        <rect x="40" y="112" width="170" height="34" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="125" y="134" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle">
          narrates instead of acting
        </text>

        <line x1="125" y1="146" x2="125" y2="158" stroke="currentColor" strokeWidth="1.25" />
        <polygon points="121,155 125,163 129,155" fill="currentColor" opacity="0.7" />

        <rect x="40" y="164" width="170" height="34" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="125" y="186" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle">
          forgets last turn
        </text>

        <path d="M 215 181 Q 270 181 270 128 Q 270 77 215 77" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="219,73 209,77 219,81" fill="oklch(var(--accent))" />
        <text x="290" y="130" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="oklch(var(--accent))" textAnchor="middle" opacity="0.85">
          loops
        </text>
      </g>

      <text x="394" y="32" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" opacity="0.55" letterSpacing="0.06em">
        FAILURE MODE B · FULLY SCRIPTED
      </text>

      <g>
        <rect x="394" y="80" width="78" height="34" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="433" y="102" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle">
          step 1
        </text>

        <line x1="476" y1="97" x2="496" y2="97" stroke="currentColor" strokeWidth="1.25" />
        <polygon points="494,93 502,97 494,101" fill="currentColor" opacity="0.7" />

        <rect x="498" y="80" width="78" height="34" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="537" y="102" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle">
          step 2
        </text>

        <line x1="580" y1="97" x2="600" y2="97" stroke="currentColor" strokeWidth="1.25" />
        <polygon points="598,93 606,97 598,101" fill="currentColor" opacity="0.7" />

        <rect x="602" y="80" width="78" height="34" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="641" y="102" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle">
          step 3
        </text>
      </g>

      <g>
        <text x="394" y="158" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" opacity="0.7">
          off-script input
        </text>

        <path d="M 482 154 Q 500 154 510 128" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="506,131 512,124 514,134" fill="oklch(var(--accent))" />

        <g>
          <line x1="490" y1="74" x2="490" y2="120" stroke="oklch(var(--accent))" strokeWidth="1.5" />
          <line x1="486" y1="78" x2="494" y2="78" stroke="oklch(var(--accent))" strokeWidth="1.25" />
          <line x1="486" y1="86" x2="494" y2="86" stroke="oklch(var(--accent))" strokeWidth="1.25" />
          <line x1="486" y1="94" x2="494" y2="94" stroke="oklch(var(--accent))" strokeWidth="1.25" />
          <line x1="486" y1="102" x2="494" y2="102" stroke="oklch(var(--accent))" strokeWidth="1.25" />
          <line x1="486" y1="110" x2="494" y2="110" stroke="oklch(var(--accent))" strokeWidth="1.25" />
          <line x1="486" y1="118" x2="494" y2="118" stroke="oklch(var(--accent))" strokeWidth="1.25" />
        </g>

        <text x="540" y="186" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="oklch(var(--accent))" textAnchor="middle" opacity="0.85">
          dead-ends
        </text>
      </g>
    </svg>
  );
}

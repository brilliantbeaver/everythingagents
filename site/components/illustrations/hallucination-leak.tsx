export function HallucinationLeak({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-labelledby="hl-title hl-desc"
      viewBox="0 0 720 320"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="hl-title">The seam where hallucination enters</title>
      <desc id="hl-desc">
        Apex returns one value. The planner substitutes a different value
        before set clauses fire. The variable ends up holding the planner's
        substitution, not the Apex byte stream.
      </desc>

      {/* Apex output (what's true) */}
      <g transform="translate(40, 110)">
        <rect width="170" height="100" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.5" />
        <text x="85" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" textAnchor="middle" letterSpacing="0.05em" opacity="0.6">APEX RETURNED</text>
        <text x="85" y="48" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fill="currentColor" textAnchor="middle">customer_id = &quot;&quot;</text>
        <text x="85" y="68" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fill="currentColor" textAnchor="middle">verified = &quot;false&quot;</text>
        <text x="85" y="90" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9" fill="currentColor" opacity="0.55" textAnchor="middle">the truth</text>
      </g>

      {/* Connector arrow */}
      <line x1="210" y1="160" x2="282" y2="160" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      <polygon points="280,155 290,160 280,165" fill="currentColor" opacity="0.7" />

      {/* Planner substitution (the seam), shows truth crossed out, substitution highlighted */}
      <g transform="translate(290, 90)">
        <rect width="220" height="140" rx="3" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.75" />
        <text x="110" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="oklch(var(--accent))" textAnchor="middle" letterSpacing="0.05em">PLANNER SUBSTITUTES</text>

        {/* Truth, struck through */}
        <g opacity="0.45">
          <text x="110" y="50" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fill="currentColor" textAnchor="middle">customer_id = &quot;&quot;</text>
          <line x1="34" y1="46" x2="186" y2="46" stroke="currentColor" strokeWidth="1" />
          <text x="110" y="68" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fill="currentColor" textAnchor="middle">verified = &quot;false&quot;</text>
          <line x1="32" y1="64" x2="188" y2="64" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Vertical "becomes" cue */}
        <text x="110" y="86" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55" textAnchor="middle">↓ replaced with</text>

        {/* Substituted, fabricated values */}
        <text x="110" y="106" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fill="oklch(var(--accent))" textAnchor="middle">customer_id = &quot;cust_100&quot;</text>
        <text x="110" y="124" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fill="oklch(var(--accent))" textAnchor="middle">verified = &quot;true&quot;</text>
      </g>

      {/* Annotation: where the substitution comes from */}
      <g>
        <path d="M 400 250 Q 380 270 360 270 L 230 270" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" strokeDasharray="3 3" />
        <polygon points="232,267 222,270 232,273" fill="currentColor" opacity="0.45" />
        <text x="400" y="268" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.7" textAnchor="start">prior turns leak in</text>
        <text x="400" y="284" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55" textAnchor="start">(alice was verified earlier in the chat)</text>
      </g>

      {/* Variables sink, what set clauses store */}
      <g transform="translate(540, 110)">
        <rect width="150" height="100" rx="3" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.5" />
        <text x="75" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" textAnchor="middle" letterSpacing="0.05em" opacity="0.6">VARIABLES</text>
        <text x="75" y="46" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="10" fill="oklch(var(--accent))" textAnchor="middle">customer_id =</text>
        <text x="75" y="60" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="10" fill="oklch(var(--accent))" textAnchor="middle">&quot;cust_100&quot;</text>
        <text x="75" y="78" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="10" fill="oklch(var(--accent))" textAnchor="middle">verified = &quot;true&quot;</text>
        <text x="75" y="94" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9" fill="oklch(var(--accent))" opacity="0.85" textAnchor="middle">stored as if true</text>
      </g>

      {/* Connector to variables */}
      <line x1="510" y1="160" x2="538" y2="160" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      <polygon points="536,155 546,160 536,165" fill="currentColor" opacity="0.7" />

      {/* Title and bottom caption */}
      <text x="360" y="24" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="currentColor" textAnchor="middle" letterSpacing="0.05em" opacity="0.6">
        the seam where hallucination enters
      </text>
      <text x="360" y="306" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.55">
        @outputs.X is what the planner says, not what Apex returned
      </text>
    </svg>
  );
}

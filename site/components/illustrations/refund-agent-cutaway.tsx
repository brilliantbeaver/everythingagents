export function RefundAgentCutaway({ className }: { className?: string }) {
  const apexActions = [
    { name: "VerifyCustomer", label: "verify by email" },
    { name: "FindOrder", label: "look up order" },
    { name: "IssueReturn", label: "process refund" },
    { name: "SendReply", label: "send confirmation" },
  ];

  return (
    <svg
      role="img"
      aria-labelledby="rac-title rac-desc"
      viewBox="0 0 720 320"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="rac-title">A cutaway view of the refund agent</title>
      <desc id="rac-desc">
        The customer talks to the planner. The planner sits inside the
        Salesforce org and can call four Apex actions: VerifyCustomer,
        FindOrder, IssueReturn, SendReply. The dashed line is the org
        boundary; everything inside it runs as the agent's running user.
      </desc>

      <g transform="translate(40, 130)">
        <circle r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M -14 36 Q 0 22 14 36 V 56 H -14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="0" y="80" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.75">customer</text>
      </g>

      <g>
        <line x1="80" y1="155" x2="160" y2="155" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <polygon points="158,150 168,155 158,160" fill="currentColor" opacity="0.65" />
        <line x1="160" y1="170" x2="80" y2="170" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="3 3" />
        <polygon points="82,165 72,170 82,175" fill="currentColor" opacity="0.5" />
      </g>

      <rect
        x="160" y="40"
        width="520" height="240"
        rx="6"
        fill="oklch(var(--muted))"
        fillOpacity="0.4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="6 4"
        opacity="0.6"
      />
      <text x="172" y="58" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" letterSpacing="0.06em" opacity="0.5">SALESFORCE ORG  ·  runs as the agent user</text>

      <g transform="translate(190, 110)">
        <rect width="140" height="100" rx="3" fill="oklch(var(--background))" stroke="oklch(var(--accent))" strokeWidth="1.75" />
        <text x="70" y="22" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="oklch(var(--accent))" textAnchor="middle" letterSpacing="0.05em">PLANNER</text>
        <text x="70" y="40" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" textAnchor="middle" opacity="0.65">5 topics</text>
        <text x="70" y="56" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" textAnchor="middle" opacity="0.65">12 variables</text>
        <text x="70" y="72" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" textAnchor="middle" opacity="0.65">enabled-tools gate</text>
        <text x="70" y="88" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" textAnchor="middle" opacity="0.65">after_reasoning</text>
      </g>

      <line x1="335" y1="160" x2="395" y2="160" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      <polygon points="392,155 402,160 392,165" fill="currentColor" opacity="0.7" />

      {apexActions.map((a, i) => (
        <g key={a.name} transform={`translate(400, ${72 + i * 50})`}>
          <rect width="240" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <text x="14" y="17" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" fontWeight="600" fill="currentColor">{a.name}</text>
          <text x="14" y="32" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.6">{a.label}</text>
          <text x="225" y="25" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="10" fill="currentColor" opacity="0.5" textAnchor="end">apex://</text>
        </g>
      ))}

      <text x="360" y="305" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fill="currentColor" textAnchor="middle" opacity="0.55">
        the planner picks topics and tools; the Apex actions decide what is true
      </text>
    </svg>
  );
}

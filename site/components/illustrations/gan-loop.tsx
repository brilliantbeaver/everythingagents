export function GanLoop({ className }: { className?: string }) {
  // Generator -> artifact -> Evaluator -> findings -> Generator (loop).
  // Sprint contract sits above as a shared input to both.
  return (
    <svg
      role="img"
      aria-labelledby="gan-title gan-desc"
      viewBox="0 0 720 320"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="gan-title">Generator–evaluator loop</title>
      <desc id="gan-desc">
        A GAN-inspired pattern. The generator produces an artifact. The
        evaluator interacts with that artifact through a real client (browser,
        terminal, API), grades it against a sprint contract, and returns
        findings. The generator iterates. The contract is shared input to
        both, written before any code is generated.
      </desc>

      {/* Sprint contract (shared input) */}
      <g transform="translate(280, 20)">
        <rect width="160" height="46" rx="4" fill="none" stroke="oklch(var(--accent))" strokeWidth="1.5" />
        <text x="80" y="20" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="11" fontWeight="600" fill="oklch(var(--accent))">
          sprint contract
        </text>
        <text x="80" y="36" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="9.5" fill="currentColor" opacity="0.55">
          what does done look like
        </text>
      </g>

      {/* Generator */}
      <g transform="translate(60, 130)">
        <rect width="170" height="80" rx="4" fill="oklch(var(--muted))" stroke="currentColor" strokeWidth="1.25" />
        <text x="85" y="32" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="currentColor">
          generator
        </text>
        <text x="85" y="50" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          writes code
        </text>
        <text x="85" y="64" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          iterates on findings
        </text>
      </g>

      {/* Artifact */}
      <g transform="translate(280, 130)">
        <rect width="160" height="80" rx="4" fill="oklch(var(--background))" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <text x="80" y="32" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="12" fontWeight="600" fill="currentColor">
          live artifact
        </text>
        <text x="80" y="50" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          running app · page
        </text>
        <text x="80" y="64" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          binary · PR
        </text>
      </g>

      {/* Evaluator */}
      <g transform="translate(490, 130)">
        <rect width="170" height="80" rx="4" fill="oklch(var(--muted))" stroke="oklch(var(--accent))" strokeWidth="1.5" />
        <text x="85" y="32" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="13" fontWeight="600" fill="oklch(var(--accent))">
          evaluator
        </text>
        <text x="85" y="50" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          drives the artifact
        </text>
        <text x="85" y="64" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10" fill="currentColor" opacity="0.55">
          grades, emits findings
        </text>
      </g>

      <defs>
        <marker id="gan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.6" />
        </marker>
        <marker id="gan-arrow-acc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="oklch(var(--accent))" />
        </marker>
      </defs>

      {/* Forward arrows */}
      <g fill="none" strokeWidth="1.25">
        <line x1="230" y1="170" x2="276" y2="170" stroke="currentColor" opacity="0.65" markerEnd="url(#gan-arrow)" />
        <line x1="440" y1="170" x2="486" y2="170" stroke="currentColor" opacity="0.65" markerEnd="url(#gan-arrow)" />
      </g>

      {/* Findings (return) */}
      <g fill="none" strokeWidth="1.5">
        <path d="M572,210 Q572,260 360,260 Q145,260 145,210" stroke="oklch(var(--accent))" markerEnd="url(#gan-arrow-acc)" />
        <text x="360" y="280" textAnchor="middle" fontFamily="var(--font-inter), system-ui, sans-serif" fontSize="10.5" fill="oklch(var(--accent))" fontWeight="600">
          findings · failed criteria · code pointers
        </text>
      </g>

      {/* Contract input arrows */}
      <g stroke="currentColor" opacity="0.4" strokeWidth="0.9" strokeDasharray="2 3" fill="none">
        <line x1="320" y1="66" x2="170" y2="130" />
        <line x1="400" y1="66" x2="560" y2="130" />
      </g>
    </svg>
  );
}

export function NeurosymbolicFrame({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-labelledby="nsf-title nsf-desc"
      viewBox="0 0 720 200"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="nsf-title">
        Neural choice nested inside a symbolic scaffold
      </title>
      <desc id="nsf-desc">
        A soft, cloud-shaped neural region — where the language model
        decides — sits inside a hard rectangular frame whose edges are the
        symbolic scaffolding: available-when gates, the topic finite state
        machine, and typed Apex inputs and outputs. The two together form a
        neuro-symbolic system.
      </desc>

      <g>
        <rect
          x="60"
          y="40"
          width="600"
          height="120"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <line x1="60" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="130"
          y="32"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="10"
          fontWeight="600"
          fill="currentColor"
          opacity="0.65"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          TYPED I/O
        </text>

        <line x1="280" y1="40" x2="440" y2="40" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="360"
          y="32"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="10"
          fontWeight="600"
          fill="currentColor"
          opacity="0.65"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          AVAILABLE WHEN
        </text>

        <line x1="520" y1="40" x2="660" y2="40" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="590"
          y="32"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="10"
          fontWeight="600"
          fill="currentColor"
          opacity="0.65"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          TOPIC FSM
        </text>

        <text
          x="360"
          y="180"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="11"
          fontWeight="600"
          fill="currentColor"
          opacity="0.55"
          letterSpacing="0.08em"
          textAnchor="middle"
        >
          SYMBOLIC SCAFFOLD
        </text>
      </g>

      <g>
        <path
          d="M 270 100
             C 270 80, 290 65, 320 70
             C 330 55, 360 55, 380 65
             C 410 55, 440 70, 440 90
             C 460 95, 460 120, 440 128
             C 440 145, 410 150, 385 138
             C 360 150, 320 145, 305 130
             C 280 130, 265 115, 270 100 Z"
          fill="oklch(var(--accent))"
          fillOpacity="0.12"
          stroke="oklch(var(--accent))"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x="355"
          y="100"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
          fill="oklch(var(--accent))"
          textAnchor="middle"
        >
          neural choice
        </text>
        <text
          x="355"
          y="118"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="10"
          fill="currentColor"
          opacity="0.7"
          textAnchor="middle"
        >
          the LLM picks an action
        </text>
      </g>

      <g stroke="currentColor" strokeWidth="1" opacity="0.35">
        <line x1="60" y1="70" x2="80" y2="70" />
        <line x1="60" y1="100" x2="80" y2="100" />
        <line x1="60" y1="130" x2="80" y2="130" />
        <line x1="640" y1="70" x2="660" y2="70" />
        <line x1="640" y1="100" x2="660" y2="100" />
        <line x1="640" y1="130" x2="660" y2="130" />
      </g>

      <g>
        <line
          x1="160"
          y1="100"
          x2="262"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
        <polygon points="260,96 268,100 260,104" fill="currentColor" opacity="0.45" />
        <line
          x1="560"
          y1="100"
          x2="455"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
        <polygon points="457,96 449,100 457,104" fill="currentColor" opacity="0.45" />
      </g>
    </svg>
  );
}

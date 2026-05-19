export function HarnessSixComponents({ className }: { className?: string }) {
  const components = [
    { letter: "E", name: "Execution", sub: "the loop", angle: -60, accent: false },
    { letter: "T", name: "Tools", sub: "the registry", angle: 0, accent: false },
    { letter: "C", name: "Context", sub: "the buffer", angle: 60, accent: false },
    { letter: "S", name: "State", sub: "what survives turns", angle: 120, accent: true },
    { letter: "L", name: "Lifecycle", sub: "the hooks", angle: 180, accent: false },
    { letter: "V", name: "Eval", sub: "the trajectories", angle: 240, accent: true },
  ];

  const cx = 480;
  const cy = 260;
  // Orbit radius for the component nodes (centers).
  const orbit = 200;
  // Approximate cloud silhouette half-extents (the path is wider than
  // tall). Connectors start just outside the cloud edge per axis so they
  // don't visually pierce the silhouette.
  const cloudHalfX = 110;
  const cloudHalfY = 50;
  // Node circle radius.
  const nodeR = 30;

  return (
    <svg
      role="img"
      aria-labelledby="hsc-title hsc-desc"
      viewBox="0 0 960 540"
      className={className}
      style={{ color: "oklch(var(--foreground))" }}
    >
      <title id="hsc-title">The six components of a coding harness</title>
      <desc id="hsc-desc">
        A neural model sits at the center. Six harness components surround
        it: Execution loop, Tools registry, Context manager, State store,
        Lifecycle hooks, and Evaluation interface. State and Eval — the
        two flagged as systematically underbuilt — are emphasized in the
        warm amber accent.
      </desc>

      <circle
        cx={cx}
        cy={cy}
        r={orbit + 32}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.15"
        strokeDasharray="3 5"
      />

      <g transform={`translate(0, ${cy - 200})`}>
        <path
          d="M 400 200
             C 400 180, 420 165, 450 170
             C 460 155, 490 155, 510 165
             C 540 155, 570 170, 570 190
             C 590 195, 590 220, 570 228
             C 570 245, 540 250, 515 238
             C 490 250, 450 245, 435 230
             C 410 230, 395 215, 400 200 Z"
          fill="oklch(var(--accent))"
          fillOpacity="0.08"
          stroke="oklch(var(--accent))"
          strokeWidth="1.25"
          strokeDasharray="4 3"
        />
      </g>
      <text
        x={cx}
        y={cy - 4}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="14"
        fontWeight="600"
        fill="oklch(var(--accent))"
        textAnchor="middle"
      >
        model
      </text>
      <text
        x={cx}
        y={cy + 14}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fill="currentColor"
        opacity="0.6"
        textAnchor="middle"
      >
        opaque from the harness
      </text>

      {components.map((c) => {
        const rad = (c.angle * Math.PI) / 180;
        const dx = Math.cos(rad);
        const dy = Math.sin(rad);
        const nx = cx + dx * orbit;
        const ny = cy + dy * orbit;
        // Inner endpoint: distance from center to where the ray exits the
        // cloud's elliptical silhouette. Using an ellipse approximation so
        // connectors sit cleanly on the cloud edge regardless of angle.
        const ellipseExit = (cloudHalfX * cloudHalfY) /
          Math.sqrt((cloudHalfY * dx) ** 2 + (cloudHalfX * dy) ** 2);
        const startR = ellipseExit + 8; // small gap between cloud and line
        const endR = orbit - nodeR - 2; // small gap before the node
        const ix = cx + dx * startR;
        const iy = cy + dy * startR;
        const cxConn = cx + dx * endR;
        const cyConn = cy + dy * endR;
        const stroke = c.accent ? "oklch(var(--accent))" : "currentColor";
        const strokeWidth = c.accent ? "1.75" : "1.25";
        const labelOffset = 52;
        const labelX = cx + Math.cos(rad) * (orbit + labelOffset);
        const labelY = cy + Math.sin(rad) * (orbit + labelOffset);
        const anchor =
          Math.cos(rad) > 0.3
            ? "start"
            : Math.cos(rad) < -0.3
            ? "end"
            : "middle";

        return (
          <g key={c.letter}>
            <line
              x1={ix}
              y1={iy}
              x2={cxConn}
              y2={cyConn}
              stroke="currentColor"
              strokeWidth="1"
              opacity={c.accent ? "0.55" : "0.35"}
            />
            <circle
              cx={nx}
              cy={ny}
              r={nodeR}
              fill="oklch(var(--background))"
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            <text
              x={nx}
              y={ny + 6}
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="20"
              fontWeight="600"
              fill={c.accent ? "oklch(var(--accent))" : "currentColor"}
              textAnchor="middle"
            >
              {c.letter}
            </text>
            <text
              x={labelX}
              y={labelY - 2}
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="13"
              fontWeight="600"
              fill={c.accent ? "oklch(var(--accent))" : "currentColor"}
              textAnchor={anchor}
            >
              {c.name}
            </text>
            <text
              x={labelX}
              y={labelY + 14}
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontSize="10"
              fill="currentColor"
              opacity="0.6"
              textAnchor={anchor}
            >
              {c.sub}
            </text>
          </g>
        );
      })}

      <text
        x={cx}
        y={525}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="11"
        fill="currentColor"
        textAnchor="middle"
        opacity="0.55"
      >
        E, T, C, S, L, V — six runtime concerns, six failure modes, six places to look first
      </text>
    </svg>
  );
}

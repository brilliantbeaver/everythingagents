import { ImageResponse } from "next/og";

export const alt = "Everything Agents: tutorials for building reliable agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "#fbf8f2",
          color: "#1d1a14",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 24 24">
            <path d="M3 3 L3 21 L21 21 Z" fill="#c8862c" />
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
              fill="none"
              stroke="#1d1a14"
              strokeWidth="1.5"
            />
            <path
              d="M3 3 L21 21"
              stroke="#1d1a14"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
          <div
            style={{
              fontSize: 36,
              letterSpacing: "-0.01em",
              fontWeight: 500,
            }}
          >
            Everything Agents
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 80,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            Tutorials for building reliable agents.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#5a544a",
              maxWidth: 900,
            }}
          >
            Real code, real bugs, real fixes.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#5a544a",
          }}
        >
          <span>everythingagents.org</span>
          <span>Free to read</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

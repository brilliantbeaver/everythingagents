import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf8f2",
          borderRadius: 36,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24">
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
      </div>
    ),
    { ...size }
  );
}

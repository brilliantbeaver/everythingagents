/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Slug rename: agentscript-determinism → guided-determinism (permanent)
      {
        source: "/topics/agentscript-determinism",
        destination: "/topics/guided-determinism",
        permanent: true,
      },
      {
        source: "/topics/agentscript-determinism/:lesson",
        destination: "/topics/guided-determinism/:lesson",
        permanent: true,
      },
      // Slug rename: agent-coding-harnesses → agent-harnesses (the topic
      // is about harnesses in general; coding agents are just the running
      // example).
      {
        source: "/topics/agent-coding-harnesses",
        destination: "/topics/agent-harnesses",
        permanent: true,
      },
      {
        source: "/topics/agent-coding-harnesses/:lesson",
        destination: "/topics/agent-harnesses/:lesson",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        border: "oklch(var(--border))",
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        code: {
          DEFAULT: "oklch(var(--code-bg))",
        },
        ring: "oklch(var(--ring))",
        // Visualizer-only tokens. The visualizer route group sets these
        // HSL vars (via .visualizer-scope) so the cool slate tool palette
        // can coexist with the warm OKLCH site palette without bleeding.
        card: {
          DEFAULT: "hsl(var(--app-card, 0 0% 100%))",
          foreground: "hsl(var(--app-card-foreground, 222 47% 11%))",
        },
        primary: {
          DEFAULT: "hsl(var(--app-primary, 222 47% 11%))",
          foreground: "hsl(var(--app-primary-foreground, 210 40% 98%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--app-destructive, 0 72% 51%))",
          foreground: "hsl(var(--app-destructive-foreground, 0 0% 100%))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        prose: "72ch",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

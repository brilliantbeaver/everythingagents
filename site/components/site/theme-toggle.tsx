"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Mode = "light" | "system" | "dark";

const ORDER: Mode[] = ["light", "system", "dark"];

const ICONS: Record<Mode, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  system: Monitor,
  dark: Moon,
};

const LABELS: Record<Mode, string> = {
  light: "Light",
  system: "System",
  dark: "Dark",
};

function nextMode(current: Mode): Mode {
  const i = ORDER.indexOf(current);
  return ORDER[(i + 1) % ORDER.length];
}

// Single-button theme cycler. Click advances light → system → dark → light.
// Icon reflects the chosen mode (not the resolved one) so users can see when
// they're on "system". Compact footprint matches the rest of the site chrome.
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reserve space during SSR to avoid layout shift, but render nothing visible.
  if (!mounted) {
    return <span aria-hidden className="inline-block h-9 w-9" />;
  }

  const current: Mode = (theme === "light" || theme === "dark" || theme === "system")
    ? (theme as Mode)
    : "system";
  const next = nextMode(current);
  const Icon = ICONS[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABELS[current]}. Click to switch to ${LABELS[next]}.`}
      title={`Theme: ${LABELS[current]} — click for ${LABELS[next]}`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground/70 transition-colors hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

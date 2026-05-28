// The visualizer used to ship its own theme toggle (a 3-pill segmented
// control with hand-rolled localStorage handling). It now uses the site's
// shared ThemeToggle so light/system/dark are consistent across both
// surfaces, persisted via next-themes, and visually identical.
export { ThemeToggle } from "@/components/site/theme-toggle";

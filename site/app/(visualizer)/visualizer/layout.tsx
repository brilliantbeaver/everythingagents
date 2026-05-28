import { AppShell } from "@/components/visualizer/app-shell";

export default function VisualizerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

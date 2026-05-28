import Link from "next/link";
import { AlertCircle, Upload } from "lucide-react";

export function ViewError({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <Link
          href="/visualizer/upload"
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
        >
          <Upload className="h-4 w-4" />
          Upload a file
        </Link>
      </div>
    </div>
  );
}

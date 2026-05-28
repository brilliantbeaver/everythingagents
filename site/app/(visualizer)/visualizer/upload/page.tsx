"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/visualizer/ui/card";
import { cn } from "@/lib/utils";

type Status = "idle" | "uploading" | "ok" | "error";

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".agent")) {
        setStatus("error");
        setMessage("Only .agent files are supported.");
        return;
      }
      setStatus("uploading");
      setMessage(`Uploading ${file.name}…`);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/visualizer/agents", { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Upload failed");
        setStatus("ok");
        setMessage("Uploaded. Opening graph…");
        window.dispatchEvent(new Event("agents:changed"));
        setTimeout(() => router.push(`/visualizer/agents/${j.item.id}`), 400);
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Upload failed");
      }
    },
    [router],
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-8 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Upload an AgentScript file</h1>
        <p className="mt-2 text-muted-foreground">
          Drop a <code className="rounded bg-muted px-1.5 py-0.5">.agent</code> file or browse. Files are stored in
          <code className="ml-1 rounded bg-muted px-1.5 py-0.5">app/uploads/</code>.
        </p>

        <Card className="mt-8">
          <CardContent className="p-0">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "m-5 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
                dragOver ? "border-accent bg-accent/5" : "border-border",
              )}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <FileUp className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Drag and drop your .agent file</p>
              <p className="mt-1 text-xs text-muted-foreground">or</p>
              <button
                onClick={() => inputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Choose file
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".agent"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
            </div>
            {status !== "idle" && (
              <div
                className={cn(
                  "mx-5 mb-5 flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                  status === "ok" && "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
                  status === "error" && "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
                  status === "uploading" && "border-border bg-muted text-foreground",
                )}
              >
                {status === "uploading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "ok" && <CheckCircle2 className="h-4 w-4" />}
                {status === "error" && <AlertCircle className="h-4 w-4" />}
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">What is an .agent file?</CardTitle>
            <CardDescription>
              A YAML-flavored declarative file describing a Salesforce Agentforce agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li><code>system</code> — instructions and welcome/error messages</li>
              <li><code>config</code> — developer name, agent type, label, description</li>
              <li><code>variables</code> — typed slots used during reasoning</li>
              <li><code>start_agent</code> — the entry router</li>
              <li><code>subagent</code> — domain-scoped reasoning blocks with their own actions</li>
              <li><code>modality</code> / <code>connection</code> — voice / channel configuration</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

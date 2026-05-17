"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

/**
 * Friendly "get notified about new tutorials" entry point.
 *
 * Anonymous users see this in the header. Clicking it opens Clerk's
 * sign-up modal. The framing is opt-in and value-adding, never coercive.
 * Content is fully readable without signing up.
 */
export function NotifyCTA() {
  return (
    <SignUpButton mode="modal">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-transparent px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Bell className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Get notified</span>
      </button>
    </SignUpButton>
  );
}

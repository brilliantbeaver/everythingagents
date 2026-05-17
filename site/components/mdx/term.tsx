"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState, type ReactNode } from "react";

export function Term({ children, definition }: { children: ReactNode; definition?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span
          tabIndex={0}
          className="cursor-help underline decoration-muted-foreground decoration-dotted underline-offset-2 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          {children}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          className="ui-sans z-50 max-w-xs rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground shadow-md"
        >
          <p className="font-semibold">{children}</p>
          {definition && <p className="mt-1 text-muted-foreground">{definition}</p>}
          <Popover.Arrow className="fill-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

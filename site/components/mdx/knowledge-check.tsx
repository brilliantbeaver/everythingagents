"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Check, X } from "lucide-react";

interface OptionProps {
  correct?: boolean;
  children: ReactNode;
}

export function Option({ children }: OptionProps) {
  return <>{children}</>;
}

export function Explanation({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

interface KnowledgeCheckProps {
  question: string;
  storageKey?: string;
  children: ReactNode;
}

export function KnowledgeCheck({ question, storageKey, children }: KnowledgeCheckProps) {
  const childrenArray = Children.toArray(children);
  const options = childrenArray.filter(
    (c): c is ReactElement<OptionProps> =>
      isValidElement(c) && (c.type as { displayName?: string; name?: string }).name === "Option"
  );
  const explanation = childrenArray.find(
    (c) => isValidElement(c) && (c.type as { name?: string }).name === "Explanation"
  );

  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [mounted, setMounted] = useState(false);

  const key = storageKey ?? `kc:${question.slice(0, 80)}`;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setSelected(Number(saved));
    }
  }, [key]);

  function pick(i: number) {
    setSelected(i);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, String(i));
    }
  }

  return (
    <section
      aria-label="Quick check"
      className="my-8 rounded-md border border-border bg-muted/30 p-5"
    >
      <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Quick check
      </p>
      <p className="mt-2 font-serif text-base text-foreground">{question}</p>

      <ul className="mt-4 space-y-2">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = opt.props.correct === true;
          const showState = mounted && isSelected;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => pick(i)}
                className={`ui-sans w-full rounded-md border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  showState
                    ? isCorrect
                      ? "border-accent bg-[oklch(96%_0.04_70_/_1)] dark:bg-[oklch(24%_0.04_70_/_1)]"
                      : "border-[oklch(55%_0.16_30)] bg-[oklch(96%_0.05_30_/_1)] dark:bg-[oklch(24%_0.05_30_/_1)]"
                    : "border-border bg-background hover:bg-muted/40"
                }`}
                aria-pressed={isSelected}
              >
                <span className="flex items-start gap-2">
                  {showState ? (
                    isCorrect ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(55%_0.16_30)]" aria-hidden />
                    )
                  ) : (
                    <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full border border-muted-foreground/40" />
                  )}
                  <span className="flex-1 [&>p]:m-0">{opt.props.children}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {mounted && selected !== null && (
        <div className="mt-4" aria-live="polite">
          <button
            type="button"
            onClick={() => setShowExplanation((v) => !v)}
            className="ui-sans text-xs text-accent hover:underline focus-visible:outline-none focus-visible:underline"
          >
            {showExplanation ? "Hide explanation" : "Show explanation"}
          </button>
          {showExplanation && explanation && (
            <div className="ui-sans mt-2 text-sm text-foreground/85 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
              {(explanation as ReactElement<{ children: ReactNode }>).props.children}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

KnowledgeCheck.Option = Option;
KnowledgeCheck.Explanation = Explanation;

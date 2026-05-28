"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { yaml } from "@codemirror/lang-yaml";
import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

export interface CodeEditorHandle {
  /** Move caret to the given 1-based line and scroll it into view. */
  jumpToLine: (line: number) => void;
  /** Force-save: returns the current document text. */
  getDoc: () => string;
}

interface Props {
  initialValue: string;
  onChange?: (doc: string) => void;
  /** Save shortcut (Cmd/Ctrl-S). */
  onSave?: (doc: string) => void;
  /** Whether the editor's contents are read-only. */
  readOnly?: boolean;
  /** Whether long lines should soft-wrap. Default false. */
  lineWrap?: boolean;
}

// Syntax highlight palette driven by CSS variables. Light values are tuned
// against a near-white surface (GitHub-light-flavoured: green comments,
// maroon strings, blue keywords, teal types, purple functions). Dark values
// use brighter analogues calibrated for AAA contrast on the dark canvas
// (slate-50 base text, sky/teal/purple/peach accents). The variables are
// overridden under `.dark` in globals.css so the editor follows the host
// theme without remounting.
const codeHighlight = HighlightStyle.define([
  { tag: t.comment, color: "var(--cm-comment)" },
  { tag: t.lineComment, color: "var(--cm-comment)" },
  { tag: t.blockComment, color: "var(--cm-comment)" },
  { tag: t.string, color: "var(--cm-string)" },
  { tag: t.special(t.string), color: "var(--cm-string)" },
  { tag: t.number, color: "var(--cm-keyword)" },
  { tag: t.bool, color: "var(--cm-keyword)" },
  { tag: t.atom, color: "var(--cm-keyword)" },
  { tag: t.null, color: "var(--cm-keyword)" },
  { tag: t.keyword, color: "var(--cm-keyword)" },
  { tag: t.operator, color: "var(--cm-text)" },
  { tag: t.propertyName, color: "var(--cm-keyword)" },
  { tag: t.definition(t.propertyName), color: "var(--cm-keyword)" },
  { tag: t.typeName, color: "var(--cm-type)" },
  { tag: t.className, color: "var(--cm-type)" },
  { tag: t.variableName, color: "var(--cm-text)" },
  { tag: t.function(t.variableName), color: "var(--cm-function)" },
  { tag: t.punctuation, color: "var(--cm-text)" },
  { tag: t.bracket, color: "var(--cm-text)" },
  { tag: t.tagName, color: "var(--cm-comment)" },
  { tag: t.invalid, color: "var(--cm-invalid)" },
]);

// Editor chrome theme — surface colors, gutters, selection. Fonts come from
// the host app's mono stack.
const editorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      fontSize: "13px",
      backgroundColor: "hsl(var(--background))",
      color: "var(--cm-text)",
    },
    ".cm-scroller": {
      fontFamily:
        'Menlo, Monaco, "SF Mono", "Source Code Pro", Consolas, "Liberation Mono", "Courier New", monospace',
      lineHeight: "1.55",
    },
    ".cm-content": {
      padding: "8px 0",
      caretColor: "var(--cm-keyword)",
    },
    ".cm-gutters": {
      backgroundColor: "hsl(var(--muted) / 0.25)",
      color: "hsl(var(--muted-foreground))",
      border: "none",
      borderRight: "1px solid hsl(var(--border))",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 12px 0 8px",
      minWidth: "2.5rem",
    },
    ".cm-foldGutter .cm-gutterElement": {
      padding: "0 4px",
      cursor: "pointer",
      color: "transparent",
    },
    ".cm-foldGutter .cm-gutterElement:hover": {
      color: "hsl(var(--foreground))",
    },
    ".cm-line:hover ~ .cm-foldGutter .cm-gutterElement": {
      color: "hsl(var(--muted-foreground))",
    },
    ".cm-activeLine": {
      backgroundColor: "hsl(var(--muted) / 0.35)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "hsl(var(--muted) / 0.4)",
      color: "hsl(var(--foreground))",
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "var(--cm-selection) !important",
    },
    ".cm-focused .cm-selectionBackground": {
      backgroundColor: "var(--cm-selection-focus) !important",
    },
    ".cm-cursor": {
      borderLeftColor: "var(--cm-keyword)",
    },
    ".cm-matchingBracket": {
      backgroundColor: "var(--cm-bracket-bg)",
      outline: "1px solid var(--cm-bracket-outline)",
    },
    ".cm-searchMatch": {
      backgroundColor: "rgba(255, 213, 0, 0.35)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(255, 165, 0, 0.6)",
    },
    ".cm-tooltip": {
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--card))",
    },
  },
  // No `dark` flag — colors are CSS variables that flip with the host theme.
);

export const CodeEditor = forwardRef<CodeEditorHandle, Props>(function CodeEditor(
  { initialValue, onChange, onSave, readOnly = false, lineWrap = false },
  ref,
) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  // Stable callbacks so the EditorView only mounts once.
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);
  onChangeRef.current = onChange;
  onSaveRef.current = onSave;
  const readOnlyCompartment = useRef(new Compartment()).current;
  const lineWrapCompartment = useRef(new Compartment()).current;

  useImperativeHandle(
    ref,
    () => ({
      jumpToLine: (line: number) => {
        const view = viewRef.current;
        if (!view) return;
        const doc = view.state.doc;
        const safeLine = Math.max(1, Math.min(line, doc.lines));
        const lineInfo = doc.line(safeLine);
        view.dispatch({
          selection: { anchor: lineInfo.from },
          effects: EditorView.scrollIntoView(lineInfo.from, { y: "center" }),
        });
        view.focus();
      },
      getDoc: () => viewRef.current?.state.doc.toString() ?? "",
    }),
    [],
  );

  // Mount once. We deliberately depend only on the host element identity —
  // editor state is mutated via dispatches, never by re-mounting.
  useEffect(() => {
    if (!hostRef.current) return;

    const saveKeymap = keymap.of([
      {
        key: "Mod-s",
        preventDefault: true,
        run: (view) => {
          onSaveRef.current?.(view.state.doc.toString());
          return true;
        },
      },
    ]);

    const updateListener = EditorView.updateListener.of((u) => {
      if (u.docChanged) {
        onChangeRef.current?.(u.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter({
          markerDOM: (open) => {
            const span = document.createElement("span");
            span.className = "cm-foldChevron";
            span.textContent = open ? "▾" : "▸";
            span.style.fontSize = "10px";
            span.style.lineHeight = "1";
            span.style.color = "currentColor";
            return span;
          },
        }),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        indentUnit.of("  "),
        bracketMatching(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        yaml(),
        syntaxHighlighting(codeHighlight, { fallback: true }),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          ...foldKeymap,
          indentWithTab,
        ]),
        saveKeymap,
        updateListener,
        editorTheme,
        lineWrapCompartment.of(lineWrap ? EditorView.lineWrapping : []),
        readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // We only mount once per component instance. initialValue is captured at
    // mount; parents pass a new key when switching files to remount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle read-only without remounting.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly, readOnlyCompartment]);

  // Toggle line-wrap without remounting.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: lineWrapCompartment.reconfigure(
        lineWrap ? EditorView.lineWrapping : [],
      ),
    });
  }, [lineWrap, lineWrapCompartment]);

  return <div ref={hostRef} className="h-full w-full" />;
});

// Lightweight AgentScript syntax tokenizer for the in-app source viewer.
// Produces an array of {text, kind} per line. Not a full grammar — covers the
// tokens that visually carry the structure: comments, strings, keys, types,
// builtins (transition, set, with, available when), references (@x.y),
// numbers, booleans.

export type TokenKind =
  | "comment"
  | "string"
  | "key"
  | "type"
  | "keyword"
  | "ref"
  | "number"
  | "bool"
  | "punct"
  | "text";

export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set([
  "transition",
  "to",
  "set",
  "with",
  "available",
  "when",
  "true",
  "True",
  "false",
  "False",
  "null",
  "None",
  "and",
  "or",
  "not",
  "is",
  "in",
  "as",
]);

const TYPES = new Set([
  "string",
  "boolean",
  "number",
  "integer",
  "float",
  "list",
  "object",
  "mutable",
  "linked",
  "constant",
]);

/** Tokenize a single line. */
export function tokenizeLine(raw: string): Token[] {
  // Comment lines and trailing comments — easiest case first.
  const commentIdx = findCommentStart(raw);
  let line = raw;
  let trailingComment: string | null = null;
  if (commentIdx >= 0) {
    trailingComment = line.slice(commentIdx);
    line = line.slice(0, commentIdx);
  }

  const tokens: Token[] = [];
  // Preserve leading indentation as plain text so column alignment isn't lost.
  const indentMatch = line.match(/^(\s*)(.*)$/);
  const indent = indentMatch ? indentMatch[1] : "";
  const rest = indentMatch ? indentMatch[2] : line;
  if (indent) tokens.push({ text: indent, kind: "text" });

  // Top-of-line key detection: `<word>:` or `<word> <word>:` (e.g. "subagent X:")
  const keyMatch = rest.match(/^([A-Za-z_][A-Za-z0-9_ ]*?)(\s*:)(.*)$/);
  if (keyMatch) {
    const keyText = keyMatch[1];
    const colon = keyMatch[2];
    const tail = keyMatch[3];

    // Split multi-word keys so e.g. "subagent X" gets keyword + key
    const parts = keyText.split(/(\s+)/);
    for (const p of parts) {
      if (!p) continue;
      if (/^\s+$/.test(p)) {
        tokens.push({ text: p, kind: "text" });
      } else if (KEYWORDS.has(p)) {
        tokens.push({ text: p, kind: "keyword" });
      } else {
        tokens.push({ text: p, kind: "key" });
      }
    }
    tokens.push({ text: colon, kind: "punct" });
    if (tail) tokens.push(...tokenizeValue(tail));
  } else {
    tokens.push(...tokenizeValue(rest));
  }

  if (trailingComment !== null) tokens.push({ text: trailingComment, kind: "comment" });
  return tokens;
}

/** Tokenize a value/expression segment (everything after a key:). */
function tokenizeValue(input: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const n = input.length;

  while (i < n) {
    const ch = input[i];

    // Whitespace passthrough
    if (ch === " " || ch === "\t") {
      let j = i;
      while (j < n && (input[j] === " " || input[j] === "\t")) j++;
      out.push({ text: input.slice(i, j), kind: "text" });
      i = j;
      continue;
    }

    // Strings (double or single quoted, no nested handling)
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < n && input[j] !== quote) {
        if (input[j] === "\\" && j + 1 < n) j += 2;
        else j++;
      }
      if (j < n) j++; // include closing quote
      out.push({ text: input.slice(i, j), kind: "string" });
      i = j;
      continue;
    }

    // References: @subagent.X, @actions.Y, @variables.Z, @outputs.foo, @utils.transition
    if (ch === "@") {
      const m = input.slice(i).match(/^@[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*/);
      if (m) {
        out.push({ text: m[0], kind: "ref" });
        i += m[0].length;
        continue;
      }
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      const m = input.slice(i).match(/^-?\d+(?:\.\d+)?/);
      if (m) {
        out.push({ text: m[0], kind: "number" });
        i += m[0].length;
        continue;
      }
    }

    // Identifiers — keyword/type/bool/text classification
    if (/[A-Za-z_]/.test(ch)) {
      const m = input.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (m) {
        const w = m[0];
        if (w === "True" || w === "False" || w === "true" || w === "false") {
          out.push({ text: w, kind: "bool" });
        } else if (KEYWORDS.has(w)) {
          out.push({ text: w, kind: "keyword" });
        } else if (TYPES.has(w)) {
          out.push({ text: w, kind: "type" });
        } else {
          out.push({ text: w, kind: "text" });
        }
        i += w.length;
        continue;
      }
    }

    // Punctuation / single chars
    out.push({ text: ch, kind: "punct" });
    i++;
  }

  return out;
}

/**
 * Locate the start of an unquoted `#` comment. Returns -1 if there isn't one.
 * We scan once, tracking whether we're inside a string literal.
 */
function findCommentStart(line: string): number {
  let inStr: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === "\\" && i + 1 < line.length) {
        i++;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      continue;
    }
    if (ch === "#") return i;
  }
  return -1;
}

/**
 * Compute fold ranges for the source. A line is foldable if it ends with `:`
 * and the next non-blank line has greater indentation. The fold covers every
 * subsequent line whose indent > the header's indent (blank lines included
 * if surrounded by deeper-indented content).
 *
 * Returns a Map from header line (1-based) -> last folded line (1-based).
 */
export function computeFolds(src: string): Map<number, number> {
  const lines = src.split(/\r?\n/);
  const indents: number[] = lines.map((l) => indentOf(l));
  const isBlank: boolean[] = lines.map((l) => l.trim() === "");
  const folds = new Map<number, number>();

  for (let i = 0; i < lines.length; i++) {
    if (isBlank[i]) continue;
    const text = lines[i].trim();
    if (!text.endsWith(":") && !/:\s*$/.test(text) && !/^- /.test(text)) continue;
    if (text.startsWith("#")) continue;

    const headerIndent = indents[i];

    // Look ahead for the first non-blank line. If its indent is greater,
    // we have a fold; extend through the last consecutive deeper line.
    let j = i + 1;
    while (j < lines.length && isBlank[j]) j++;
    if (j >= lines.length) continue;
    if (indents[j] <= headerIndent) continue;

    let last = j;
    let k = j;
    while (k < lines.length) {
      if (isBlank[k]) {
        // Blanks don't end a fold by themselves; lookahead.
        let m = k + 1;
        while (m < lines.length && isBlank[m]) m++;
        if (m < lines.length && indents[m] > headerIndent) {
          last = m;
          k = m + 1;
          continue;
        }
        break;
      }
      if (indents[k] > headerIndent) {
        last = k;
        k++;
      } else {
        break;
      }
    }

    folds.set(i + 1, last + 1);
  }

  return folds;
}

function indentOf(line: string): number {
  const m = line.match(/^(\s*)/);
  if (!m) return 0;
  // Tabs count as 4 to align with parser convention.
  let n = 0;
  for (const c of m[1]) n += c === "\t" ? 4 : 1;
  return n;
}

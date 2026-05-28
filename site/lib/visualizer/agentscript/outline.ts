// Build a navigable outline of an AgentScript source file by scanning for
// recognizable top-level and second-level headings. We only need line numbers
// (for scroll-to) and a label, so a lightweight scan over raw text is enough —
// no need to traverse the full AST.

export type OutlineGroupKind =
  | "settings"
  | "variables"
  | "subagents"
  | "actions"
  | "system_messages"
  | "connections"
  | "modality"
  | "language"
  | "other";

export interface OutlineItem {
  label: string;
  line: number;
}

export interface OutlineGroup {
  kind: OutlineGroupKind;
  label: string;
  line: number;
  items: OutlineItem[];
}

interface Section {
  key: string;
  line: number;
  /** Indentation of the header. */
  indent: number;
  /** Children encountered at indent > header indent, captured as raw lines. */
  children: { text: string; indent: number; line: number }[];
}

const TAB_WIDTH = 4;

function expandIndent(raw: string): { indent: number; text: string } {
  const expanded = raw.replace(/\t/g, " ".repeat(TAB_WIDTH));
  const m = expanded.match(/^(\s*)(.*)$/);
  return { indent: m ? m[1].length : 0, text: m ? m[2] : "" };
}

/** Extract top-level sections (zero-indent keys). */
function topLevelSections(src: string): Section[] {
  const lines = src.split(/\r?\n/);
  const sections: Section[] = [];
  let current: Section | null = null;

  for (let i = 0; i < lines.length; i++) {
    const { indent, text } = expandIndent(lines[i]);
    if (!text || text.startsWith("#")) continue;

    if (indent === 0 && text.endsWith(":")) {
      current = {
        key: text.replace(/:$/, "").trim(),
        line: i + 1,
        indent: 0,
        children: [],
      };
      sections.push(current);
    } else if (current) {
      current.children.push({ text, indent, line: i + 1 });
    }
  }

  return sections;
}

/**
 * Find subagent/action header children directly under a parent block.
 * AgentScript uses a `subagent SubagentName:` style — the prefix is part of the
 * key. We capture the suffix (the actual name) for the outline.
 */
function findHeaders(
  children: Section["children"],
  prefix: string,
): OutlineItem[] {
  const out: OutlineItem[] = [];
  // The first child after `subagents:` sets the inner indent depth. Any deeper
  // line is part of a nested subagent body, not a new header.
  if (children.length === 0) return out;
  const baseIndent = children[0].indent;

  for (const c of children) {
    if (c.indent !== baseIndent) continue;
    const m = c.text.match(new RegExp(`^${prefix}\\s+([A-Za-z0-9_]+)\\s*:`));
    if (m) out.push({ label: m[1], line: c.line });
  }
  return out;
}

/** Scan top-level `Variable_Name:` definitions inside a `variables:` block. */
function findVariables(children: Section["children"]): OutlineItem[] {
  const out: OutlineItem[] = [];
  if (children.length === 0) return out;
  const baseIndent = children[0].indent;
  for (const c of children) {
    if (c.indent !== baseIndent) continue;
    const m = c.text.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/);
    if (m) out.push({ label: m[1], line: c.line });
  }
  return out;
}

/** Scan a system_messages: block where each child is a key: "string" pair. */
function findSystemMessages(children: Section["children"]): OutlineItem[] {
  const out: OutlineItem[] = [];
  if (children.length === 0) return out;
  const baseIndent = children[0].indent;
  for (const c of children) {
    if (c.indent !== baseIndent) continue;
    const m = c.text.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/);
    if (m) out.push({ label: m[1], line: c.line });
  }
  return out;
}

const KIND_LABELS: Record<OutlineGroupKind, string> = {
  settings: "Settings",
  variables: "Variables",
  subagents: "Agents",
  actions: "Actions",
  system_messages: "System Messages",
  connections: "Connections",
  modality: "Modality",
  language: "Language",
  other: "Other",
};

function classify(key: string): OutlineGroupKind {
  // AgentScript declarations come in two shapes:
  //   1. Bare block headers   — e.g. `variables:`, `system_messages:`
  //   2. Prefixed declarations — e.g. `subagent customer_verification:`,
  //      `start_agent subagent_selector:`, `connection telephony:`,
  //      `modality voice:`, `action SomeAction:`
  // The classifier must match on the FIRST WORD so prefixed declarations
  // bucket alongside their plural-block counterparts. Without this, a
  // file that uses only the prefixed form puts every block into "other".
  const k = key.toLowerCase().trim();
  const head = k.split(/\s+/)[0];
  if (head === "variables" || head === "variable") return "variables";
  if (head === "subagents" || head === "subagent" || head === "start_agent") return "subagents";
  if (head === "actions" || head === "action") return "actions";
  if (head === "system_messages") return "system_messages";
  if (head === "connection" || head === "connections") return "connections";
  if (head === "modality") return "modality";
  if (head === "language") return "language";
  if (head === "config" || head === "settings" || head === "system_instructions" || head === "system") return "settings";
  return "other";
}

// Kinds that, when they appear as a prefixed top-level declaration
// (e.g. `subagent customer_verification:`), should be coalesced into a
// single synthesized group rather than each becoming its own section.
const COALESCE_KINDS: ReadonlySet<OutlineGroupKind> = new Set([
  "subagents",
  "actions",
  "connections",
  "modality",
  "system_messages",
]);

function isPrefixedDeclaration(key: string): boolean {
  return /\s/.test(key.trim());
}

function humanizeKey(key: string): string {
  // "system_instructions" -> "System Instructions", "config" -> "Config"
  return key
    .trim()
    .split(/[\s_]+/)
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

function declarationName(key: string): string {
  // "subagent customer_verification" -> "customer_verification"
  // "start_agent subagent_selector"  -> "subagent_selector"
  // "connection telephony"            -> "telephony"
  const parts = key.trim().split(/\s+/);
  return parts.slice(1).join(" ") || key;
}

export function buildOutline(src: string): OutlineGroup[] {
  const sections = topLevelSections(src);
  const groups: OutlineGroup[] = [];
  // Coalesced groups, indexed by kind so we only emit one per kind.
  const coalesced = new Map<OutlineGroupKind, OutlineGroup>();

  const ensureCoalesced = (kind: OutlineGroupKind, line: number): OutlineGroup => {
    let g = coalesced.get(kind);
    if (!g) {
      g = { kind, label: KIND_LABELS[kind], line, items: [] };
      coalesced.set(kind, g);
      groups.push(g);
    }
    return g;
  };

  for (const s of sections) {
    const kind = classify(s.key);
    const prefixed = isPrefixedDeclaration(s.key);

    // Prefixed declarations of coalesced kinds: emit as a leaf item under
    // a single synthesized group so the user sees one "Agents", one
    // "Connection", etc., regardless of how many top-level declarations
    // the source contains.
    if (prefixed && COALESCE_KINDS.has(kind)) {
      const g = ensureCoalesced(kind, s.line);
      // For start_agent, prepend a marker so the user can tell it apart
      // from regular subagents in the flat list.
      const head = s.key.toLowerCase().split(/\s+/)[0];
      const name = declarationName(s.key);
      const label = head === "start_agent" ? `${name} (start)` : name;
      g.items.push({ label, line: s.line });
      continue;
    }

    // Bare block headers: parent group with children parsed from the body.
    let items: OutlineItem[] = [];
    if (kind === "subagents") {
      items = findHeaders(s.children, "subagent");
    } else if (s.key === "start_agent") {
      items = findHeaders(s.children, "subagent");
      if (items.length === 0) items = [{ label: "start_agent", line: s.line }];
    } else if (kind === "actions") {
      items = findVariables(s.children);
    } else if (kind === "variables") {
      items = findVariables(s.children);
    } else if (kind === "system_messages") {
      items = findSystemMessages(s.children);
    }

    // For coalesced kinds in BARE form, route into the same coalesced
    // group so a mixed file (a `subagents:` block plus prefixed
    // `subagent X:` declarations) still surfaces as a single bucket.
    if (COALESCE_KINDS.has(kind)) {
      const g = ensureCoalesced(kind, s.line);
      for (const it of items) g.items.push(it);
      continue;
    }

    // For settings-kind blocks, multiple distinct keys (`config:`, `system:`,
    // `settings:`, `system_instructions:`) all classify the same — labeling
    // each one "Settings" produces duplicate rows. Use the source key itself
    // (humanized) as the label so the user can tell them apart.
    const label =
      kind === "settings"
        ? humanizeKey(s.key)
        : KIND_LABELS[kind] === "Other"
          ? s.key
          : KIND_LABELS[kind];

    groups.push({
      kind,
      label,
      line: s.line,
      items,
    });
  }

  return groups;
}

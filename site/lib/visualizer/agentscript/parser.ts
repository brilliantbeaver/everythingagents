// Tolerant indentation-aware parser for Salesforce AgentScript (.agent) files.
//
// This is *not* a full YAML parser. AgentScript's grammar uses custom tokens
// (`@subagent.X`, `transition to ...`, `set @variables.x = @outputs.y`, etc.)
// that aren't valid YAML, and the official parser isn't open-source. Our goal
// is structural extraction sufficient for graph visualization, not round-trip
// fidelity. Unknown content is preserved as `raw` for inspection.

import type {
  ActionBinding,
  ActionDef,
  ActionInputOutput,
  AgentScriptAST,
  SubagentDef,
  VariableDef,
} from "./types";

interface Line {
  /** Raw line including indentation */
  raw: string;
  /** Indentation in spaces (tabs expanded to 4). */
  indent: number;
  /** Trimmed content; "" for blank lines. */
  text: string;
  /** 1-based line number. */
  lineNo: number;
}

const TAB_WIDTH = 4;

function tokenize(src: string): Line[] {
  const out: Line[] = [];
  const rawLines = src.split(/\r?\n/);
  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const expanded = raw.replace(/\t/g, " ".repeat(TAB_WIDTH));
    const m = expanded.match(/^(\s*)(.*)$/);
    const indent = m ? m[1].length : 0;
    const text = m ? m[2] : "";
    out.push({ raw: expanded, indent, text, lineNo: i + 1 });
  }
  return out;
}

/** Read a child block: every subsequent non-blank line whose indent > parentIndent. */
function readBlock(lines: Line[], startIdx: number, parentIndent: number): { body: Line[]; nextIdx: number } {
  const body: Line[] = [];
  let i = startIdx;
  while (i < lines.length) {
    const ln = lines[i];
    if (ln.text === "") {
      body.push(ln);
      i++;
      continue;
    }
    if (ln.indent <= parentIndent) break;
    body.push(ln);
    i++;
  }
  // Trim trailing blank lines from body
  while (body.length && body[body.length - 1].text === "") body.pop();
  return { body, nextIdx: i };
}

/** Strip a uniform leading indent from a list of lines and return joined text. */
function dedentJoin(body: Line[]): string {
  const nonBlank = body.filter((l) => l.text !== "");
  if (nonBlank.length === 0) return "";
  const minIndent = Math.min(...nonBlank.map((l) => l.indent));
  return body.map((l) => (l.text === "" ? "" : l.raw.slice(minIndent))).join("\n").replace(/\s+$/, "");
}

/** Split a block into top-level child entries: lines whose indent equals the smallest indent. */
function splitChildren(body: Line[]): { header: Line; body: Line[] }[] {
  const nonBlank = body.filter((l) => l.text !== "");
  if (nonBlank.length === 0) return [];
  const childIndent = Math.min(...nonBlank.map((l) => l.indent));
  const out: { header: Line; body: Line[] }[] = [];
  let i = 0;
  while (i < body.length) {
    const ln = body[i];
    if (ln.text === "" || ln.indent !== childIndent) {
      i++;
      continue;
    }
    const { body: subBody, nextIdx } = readBlock(body, i + 1, childIndent);
    out.push({ header: ln, body: subBody });
    i = nextIdx;
  }
  return out;
}

/** Strip surrounding quotes if present. */
function unquote(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** Parse `key: value` from a header line. Returns null if not a simple kv. */
function parseKV(text: string): { key: string; value: string } | null {
  const idx = text.indexOf(":");
  if (idx === -1) return null;
  const key = text.slice(0, idx).trim();
  const value = text.slice(idx + 1).trim();
  return { key, value };
}

/** Resolve a `description: |` or `instructions: ->` block by gluing block scalar text. */
function blockScalar(body: Line[]): string {
  return dedentJoin(body);
}

// ---------- High-level parser ----------

export function parseAgentScript(src: string, fileName: string): AgentScriptAST {
  const ast: AgentScriptAST = {
    config: {},
    language: {},
    variables: [],
    subagents: [],
    actions: [],
    source: { fileName, bytes: src.length },
  };

  const lines = tokenize(src);

  // Iterate top-level (indent === 0) headers.
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (ln.text === "" || ln.indent !== 0) {
      i++;
      continue;
    }
    const headerText = ln.text;
    const { body, nextIdx } = readBlock(lines, i + 1, 0);
    handleTopLevel(headerText, body, ast);
    i = nextIdx;
  }

  return ast;
}

function handleTopLevel(headerText: string, body: Line[], ast: AgentScriptAST): void {
  // Strip trailing colon for matching
  const head = headerText.replace(/:\s*$/, "").trim();

  // start_agent <id>:
  if (head.startsWith("start_agent ")) {
    const id = head.slice("start_agent ".length).trim();
    ast.startAgent = parseSubagent(id, body, "start_agent");
    return;
  }
  // subagent <id>:
  if (head.startsWith("subagent ")) {
    const id = head.slice("subagent ".length).trim();
    ast.subagents.push(parseSubagent(id, body, "subagent"));
    return;
  }
  // modality <kind>:
  if (head.startsWith("modality ")) {
    const kind = head.slice("modality ".length).trim();
    ast.modality = { kind, props: parseFlatProps(body) };
    return;
  }
  // connection <kind>:
  if (head.startsWith("connection ")) {
    ast.connection = parseFlatProps(body);
    return;
  }

  // Plain top-level keys: system, config, variables, language
  switch (head) {
    case "system":
      handleSystem(body, ast);
      return;
    case "config":
      ast.config = parseFlatProps(body);
      return;
    case "language":
      ast.language = parseFlatProps(body);
      return;
    case "variables":
      ast.variables = parseVariables(body);
      return;
    default:
      // Unknown top-level — ignore, but keep going
      return;
  }
}

function handleSystem(body: Line[], ast: AgentScriptAST): void {
  const children = splitChildren(body);
  for (const c of children) {
    const kv = parseKV(c.header.text);
    if (!kv) continue;
    if (kv.key === "instructions") {
      ast.systemInstructions = blockScalar(c.body);
    } else if (kv.key === "messages") {
      const msgs: Record<string, string> = {};
      for (const m of splitChildren(c.body)) {
        const mk = parseKV(m.header.text);
        if (!mk) continue;
        const inline = mk.value.replace(/^[|>](.*)$/, "$1").trim();
        msgs[mk.key] = inline ? unquote(inline) : blockScalar(m.body);
      }
      ast.systemMessages = msgs;
    }
  }
}

function parseFlatProps(body: Line[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of splitChildren(body)) {
    const kv = parseKV(c.header.text);
    if (!kv) continue;
    if (kv.value === "" && c.body.length) {
      out[kv.key] = blockScalar(c.body);
    } else {
      out[kv.key] = unquote(kv.value);
    }
  }
  return out;
}

function parseVariables(body: Line[]): VariableDef[] {
  const out: VariableDef[] = [];
  for (const c of splitChildren(body)) {
    // Header looks like:  order_number: mutable string = ""
    const kv = parseKV(c.header.text);
    if (!kv) continue;
    const def: VariableDef = {
      name: kv.key,
      typeExpr: kv.value,
      raw: [c.header.raw, ...c.body.map((l) => l.raw)].join("\n"),
    };
    for (const sub of splitChildren(c.body)) {
      const skv = parseKV(sub.header.text);
      if (!skv) continue;
      const value = skv.value === "" && sub.body.length ? blockScalar(sub.body) : unquote(skv.value);
      if (skv.key === "description") def.description = value;
      else if (skv.key === "source") def.source = value;
    }
    out.push(def);
  }
  return out;
}

function parseSubagent(id: string, body: Line[], kind: SubagentDef["kind"]): SubagentDef {
  const sub: SubagentDef = {
    id,
    kind,
    actionBindings: [],
    actions: [],
    inferredTransitions: [],
    raw: dedentJoin(body),
  };

  for (const c of splitChildren(body)) {
    const kv = parseKV(c.header.text);
    if (!kv) continue;
    const inline = kv.value.replace(/^[|>](.*)$/, "$1").trim();

    switch (kv.key) {
      case "label":
        sub.label = inline ? unquote(inline) : blockScalar(c.body);
        break;
      case "description":
        sub.description = inline ? unquote(inline) : blockScalar(c.body);
        break;
      case "before_reasoning":
        sub.beforeReasoning = blockScalar(c.body);
        sub.inferredTransitions.push(...extractTransitions(sub.beforeReasoning));
        break;
      case "after_reasoning":
        sub.afterReasoning = blockScalar(c.body);
        sub.inferredTransitions.push(...extractTransitions(sub.afterReasoning));
        break;
      case "reasoning": {
        // children: instructions, actions
        for (const r of splitChildren(c.body)) {
          const rkv = parseKV(r.header.text);
          if (!rkv) continue;
          if (rkv.key === "instructions") {
            const text = blockScalar(r.body);
            sub.instructions = text;
            sub.inferredTransitions.push(...extractTransitions(text));
          } else if (rkv.key === "actions") {
            sub.actionBindings = parseActionBindings(r.body);
          }
        }
        break;
      }
      case "actions": {
        // Inline action *definitions* (with `target:`, `inputs:`, `outputs:` etc.)
        for (const a of splitChildren(c.body)) {
          const akv = parseKV(a.header.text);
          if (!akv) continue;
          sub.actions.push(parseActionDef(akv.key, a.body, sub.id));
        }
        break;
      }
      default:
        break;
    }
  }

  // Pull transition destinations out of action bindings, too
  for (const b of sub.actionBindings) {
    if (b.transitionTo) {
      sub.inferredTransitions.push({ to: b.transitionTo });
    }
  }

  return sub;
}

function parseActionBindings(body: Line[]): ActionBinding[] {
  const out: ActionBinding[] = [];
  for (const c of splitChildren(body)) {
    // Header forms:
    //   go_to_returns: @utils.transition to @subagent.returns
    //   get_order_details: @actions.Get_Order_Details
    //   escalate_to_human: @utils.escalate
    const kv = parseKV(c.header.text);
    if (!kv) continue;
    const binding: ActionBinding = {
      localName: kv.key,
      target: kv.value,
      setsVariables: [],
      withParams: [],
      raw: [c.header.raw, ...c.body.map((l) => l.raw)].join("\n"),
    };
    // Extract `transition to @subagent.X`
    const tm = kv.value.match(/transition\s+to\s+@subagent\.([A-Za-z0-9_]+)/);
    if (tm) binding.transitionTo = tm[1];

    for (const sub of splitChildren(c.body)) {
      const t = sub.header.text;
      if (t.startsWith("description")) {
        const skv = parseKV(t);
        if (skv) binding.description = unquote(skv.value);
      } else if (t.startsWith("with ")) {
        // with foo = @variables.bar    (or `... = ...`)
        const m = t.match(/^with\s+([A-Za-z0-9_]+)\s*=\s*(.+)$/);
        if (m) binding.withParams.push({ param: m[1], value: m[2].trim() });
      } else if (t.startsWith("set ")) {
        // set @variables.foo = @outputs.bar
        const m = t.match(/^set\s+@variables\.([A-Za-z0-9_]+)\s*=\s*(.+)$/);
        if (m) binding.setsVariables.push({ variable: m[1], from: m[2].trim() });
      } else if (t.startsWith("available when")) {
        binding.availableWhen = t.replace(/^available\s+when\s+/, "").trim();
      }
    }

    out.push(binding);
  }
  return out;
}

function parseActionDef(id: string, body: Line[], ownerSubagentId?: string): ActionDef {
  const def: ActionDef = {
    id,
    inputs: [],
    outputs: [],
    ownerSubagentId,
    raw: dedentJoin(body),
  };
  for (const c of splitChildren(body)) {
    const kv = parseKV(c.header.text);
    if (!kv) continue;
    const inline = kv.value;
    switch (kv.key) {
      case "label":
        def.label = unquote(inline);
        break;
      case "description":
        def.description = inline ? unquote(inline) : blockScalar(c.body);
        break;
      case "target":
        def.target = unquote(inline);
        break;
      case "inputs":
        def.inputs = parseIO(c.body);
        break;
      case "outputs":
        def.outputs = parseIO(c.body);
        break;
      default:
        break;
    }
  }
  return def;
}

function parseIO(body: Line[]): ActionInputOutput[] {
  const out: ActionInputOutput[] = [];
  for (const c of splitChildren(body)) {
    // Header: `orderNumber: string`
    const kv = parseKV(c.header.text);
    if (!kv) continue;
    const io: ActionInputOutput = { name: kv.key, typeName: kv.value };
    for (const sub of splitChildren(c.body)) {
      const skv = parseKV(sub.header.text);
      if (!skv) continue;
      const v = skv.value === "" && sub.body.length ? blockScalar(sub.body) : unquote(skv.value);
      switch (skv.key) {
        case "label":
          io.label = v;
          break;
        case "description":
          io.description = v;
          break;
        case "is_required":
          io.isRequired = /true/i.test(v);
          break;
        case "is_displayable":
          io.isDisplayable = /true/i.test(v);
          break;
        case "complex_data_type_name":
          io.complexDataTypeName = v;
          break;
      }
    }
    out.push(io);
  }
  return out;
}

/** Find `transition to @subagent.X` references inside a free-text block. */
function extractTransitions(text: string | undefined): { to: string; condition?: string }[] {
  if (!text) return [];
  const out: { to: string; condition?: string }[] = [];
  const re = /transition\s+to\s+@subagent\.([A-Za-z0-9_]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ to: m[1] });
  }
  return out;
}

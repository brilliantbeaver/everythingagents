// Strongly-typed AST for a parsed Salesforce AgentScript (.agent) file.
//
// The .agent format is YAML-like and indentation-driven, but uses custom
// tokens such as `@subagent.X`, `@actions.Y`, `@variables.Z`, `transition to`,
// `set ... = @outputs.x`, and `available when ...`. We capture the high-level
// structure plus the references that matter for graph visualization.

export type NodeKind =
  | "system"
  | "config"
  | "language"
  | "connection"
  | "modality"
  | "start_agent"
  | "subagent"
  | "action"
  | "variable";

export interface RawBlock {
  /** Original key text, e.g. "subagent returns" or "Get_Order_Details" */
  key: string;
  /** Indented lines that belong to this block, with leading indent stripped. */
  body: string;
  /** Absolute indentation of the block header in the source, in spaces. */
  indent: number;
  /** Line range in the source file (1-indexed inclusive). */
  startLine: number;
  endLine: number;
}

export interface VariableDef {
  name: string;
  /** Raw type expression, e.g. `mutable string = ""`, `linked string`. */
  typeExpr: string;
  description?: string;
  source?: string;
  raw: string;
}

export interface ActionInputOutput {
  name: string;
  typeName: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  complexDataTypeName?: string;
  isDisplayable?: boolean;
}

export interface ActionDef {
  /** Action identifier as written, e.g. "Get_Order_Details" */
  id: string;
  label?: string;
  description?: string;
  /** apex://Handler or similar */
  target?: string;
  inputs: ActionInputOutput[];
  outputs: ActionInputOutput[];
  /** Subagent that owns this action definition, undefined if top-level. */
  ownerSubagentId?: string;
  raw: string;
}

export interface ActionBinding {
  /** The local name within the subagent's reasoning.actions block (e.g. "go_to_returns") */
  localName: string;
  /** The thing it binds to: "@actions.Foo", "@utils.transition", "@utils.escalate" */
  target: string;
  /** If the target is a transition, this is the destination subagent id. */
  transitionTo?: string;
  description?: string;
  /** "available when @variables.x == True" */
  availableWhen?: string;
  /** Variables set from outputs, e.g. `set @variables.foo = @outputs.bar` */
  setsVariables: { variable: string; from: string }[];
  /** `with foo = @variables.bar` style param wiring */
  withParams: { param: string; value: string }[];
  raw: string;
}

export interface SubagentDef {
  /** Identifier as written, e.g. "returns". For start_agent, it's "subagent_selector". */
  id: string;
  kind: "subagent" | "start_agent";
  label?: string;
  description?: string;
  /** Free-text reasoning instructions block */
  instructions?: string;
  /** Pre/post reasoning rules (raw text) */
  beforeReasoning?: string;
  afterReasoning?: string;
  /** Action bindings found inside reasoning.actions */
  actionBindings: ActionBinding[];
  /** Action definitions defined inline under this subagent */
  actions: ActionDef[];
  /** Transitions extracted from beforeReasoning/afterReasoning text */
  inferredTransitions: { to: string; condition?: string }[];
  raw: string;
}

export interface AgentScriptAST {
  systemInstructions?: string;
  systemMessages?: Record<string, string>;
  config: Record<string, string>;
  language: Record<string, string>;
  connection?: Record<string, string>;
  modality?: { kind: string; props: Record<string, string> };
  variables: VariableDef[];
  startAgent?: SubagentDef;
  subagents: SubagentDef[];
  /** Top-level actions if any are declared outside of a subagent. */
  actions: ActionDef[];
  /** Source file metadata */
  source: { fileName: string; bytes: number };
}

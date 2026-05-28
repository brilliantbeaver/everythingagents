import { decodeSourceToken, TokenError } from "@/lib/visualizer/token";
import { parseAgentScript } from "@/lib/visualizer/agentscript/parser";
import { buildGraph } from "@/lib/visualizer/agentscript/graph";
import { AgentView } from "./agent-view";
import { RefAgentView } from "./ref-agent-view";
import { ViewError } from "./view-error";

// /visualizer/view — stateless graph view.
//
// The .agent source travels with the URL itself. ?src=<token> carries a
// gzipped+base64url-encoded copy of the file; ?ref=<id> points at a
// sessionStorage entry written by the upload page (used when the source is
// too big to fit in the address bar). No server storage is involved, so
// every browser, every region, every cold Lambda renders identically.

interface SearchParams {
  src?: string | string[];
  ref?: string | string[];
}

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export const dynamic = "force-dynamic";

export default async function ViewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const src = pickFirst(params.src);
  const ref = pickFirst(params.ref);

  if (ref) {
    // sessionStorage lives only in the browser, so the resolution happens
    // client-side. The ref view fetches and renders without ever touching
    // the server's request lifecycle.
    return <RefAgentView refId={ref} />;
  }

  if (!src) {
    return (
      <ViewError
        title="No file to show"
        body="Open the Upload page and choose a .agent file to visualize."
      />
    );
  }

  let source: string;
  try {
    source = await decodeSourceToken(src);
  } catch (err) {
    return (
      <ViewError
        title="Couldn't read the file from this URL"
        body={
          err instanceof TokenError
            ? err.message
            : "The link is malformed. Re-upload the file to generate a fresh link."
        }
      />
    );
  }

  const ast = parseAgentScript(source, "uploaded.agent");
  const graph = buildGraph(ast);
  const fileName =
    (ast.config.developer_name ? `${ast.config.developer_name}.agent` : "uploaded.agent");
  const label =
    ast.config.agent_label || ast.config.developer_name || "uploaded";

  return <AgentView fileName={fileName} source={source} graph={graph} label={label} />;
}

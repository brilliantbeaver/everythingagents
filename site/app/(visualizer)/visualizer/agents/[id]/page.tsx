import { notFound } from "next/navigation";
import { readAgentFile } from "@/lib/visualizer/storage";
import { parseAgentScript } from "@/lib/visualizer/agentscript/parser";
import { buildGraph } from "@/lib/visualizer/agentscript/graph";
import { AgentView } from "./agent-view";

export const dynamic = "force-dynamic";

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await readAgentFile(id);
  if (!file) notFound();

  const ast = parseAgentScript(file.contents, file.fileName);
  const graph = buildGraph(ast);
  const label =
    ast.config.agent_label || ast.config.developer_name || file.fileName.replace(/\.agent$/, "");

  return <AgentView id={id} fileName={file.fileName} source={file.contents} graph={graph} label={label} />;
}

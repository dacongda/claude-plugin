/**
 * Shared per-call context handed to every tool handler.
 */
import type { KolmoPdfClient } from "./client.js";
import type { KolmoPdfConfig } from "./config.js";
import type { ProgressReporter } from "./progress.js";

export interface ToolContext {
  config: KolmoPdfConfig;
  /** Lazily constructed; throws invalid_api_key when the key is absent. */
  getClient(): KolmoPdfClient;
  progress?: ProgressReporter;
}

/** Standard MCP success result envelope (subset of the SDK `CallToolResult`). */
export interface McpSuccessResult {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
}

/** Wrap a JSON-serializable object into the MCP success envelope. */
export function jsonResult(data: Record<string, unknown>): McpSuccessResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

/**
 * Tool: kolmopdf_get_task_status (DEVELOPMENT.md §5.9).
 * Advanced/debug escape hatch — hidden from default LLM selection by wording
 * the description so it does not match common triggers.
 * NOTE: scaffold — handler implemented in M3.
 */
import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";

export const getTaskStatusName = "kolmopdf_get_task_status";

export const getTaskStatusDescription =
  "Advanced/debug tool. Returns raw status for a KolmoPDF task. Use only when " +
  "explicitly asked to inspect a task by ID, or when troubleshooting a stuck task.";

export const getTaskStatusInputSchema = z.object({
  task_id: z.string(),
});

export type GetTaskStatusInput = z.infer<typeof getTaskStatusInputSchema>;

export async function getTaskStatusHandler(
  _args: GetTaskStatusInput,
  _ctx: ToolContext,
): Promise<McpSuccessResult> {
  throw new Error("not_implemented: getTaskStatusHandler");
}

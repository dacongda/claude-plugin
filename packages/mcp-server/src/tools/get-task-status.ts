import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";
import { jsonResult } from "../context.js";

export const getTaskStatusName = "kolmopdf_get_task_status";

export const getTaskStatusDescription =
  "Advanced/debug tool. Returns raw status for a KolmoPDF task. Use only when " +
  "explicitly asked to inspect a task by ID, or when troubleshooting a stuck task.";

export const getTaskStatusInputSchema = z.object({
  task_id: z.string(),
});

export type GetTaskStatusInput = z.infer<typeof getTaskStatusInputSchema>;

export async function getTaskStatusHandler(
  args: GetTaskStatusInput,
  ctx: ToolContext,
): Promise<McpSuccessResult> {
  const client = ctx.getClient();
  const status = await client.getStatus(args.task_id);
  return jsonResult(status as unknown as Record<string, unknown>);
}

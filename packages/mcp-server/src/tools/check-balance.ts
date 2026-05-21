import { z } from "zod";
import { maskApiKey } from "../config.js";
import type { McpSuccessResult, ToolContext } from "../context.js";
import { jsonResult } from "../context.js";

export const checkBalanceName = "kolmopdf_check_balance";

export const checkBalanceDescription =
  "Show the current KolmoPDF credit balance for the configured API key.";

export const checkBalanceInputSchema = z.object({});

export type CheckBalanceInput = z.infer<typeof checkBalanceInputSchema>;

export interface CheckBalanceOutput {
  points: number;
  api_key_masked: string;
}

export async function checkBalanceHandler(
  _args: CheckBalanceInput,
  ctx: ToolContext,
): Promise<McpSuccessResult> {
  const client = ctx.getClient();
  const balance = await client.getBalance();

  const output: CheckBalanceOutput = {
    points: balance.points,
    api_key_masked: maskApiKey(ctx.config.apiKey || ""),
  };

  return jsonResult(output as unknown as Record<string, unknown>);
}

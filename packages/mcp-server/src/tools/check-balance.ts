/**
 * Tool: kolmopdf_check_balance (DEVELOPMENT.md §5.8).
 * Single GET /balance. Returns points + masked API key.
 * NOTE: scaffold — handler implemented in M3.
 */
import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";

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
  _ctx: ToolContext,
): Promise<McpSuccessResult> {
  throw new Error("not_implemented: checkBalanceHandler");
}

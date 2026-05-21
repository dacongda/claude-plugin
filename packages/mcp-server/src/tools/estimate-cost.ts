/**
 * Tool: kolmopdf_estimate_cost (DEVELOPMENT.md §5.7).
 * Local pdf-lib page read + a single GET /balance. Never spends credits.
 * The pure cost formula is implemented here; the handler is stubbed (M3).
 */
import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";

export const estimateCostName = "kolmopdf_estimate_cost";

export const estimateCostDescription =
  "Estimate the credit cost of a KolmoPDF operation before running it. " +
  "Reads page count locally and checks the current balance. Does not spend credits.";

export const estimateCostInputSchema = z.object({
  file_path: z.string(),
  operation: z.enum(["parse", "parse_translate", "translate", "convert"]),
  options: z
    .object({
      images_as_url: z.boolean().optional(),
    })
    .optional(),
});

export type EstimateCostInput = z.infer<typeof estimateCostInputSchema>;

export type Operation = EstimateCostInput["operation"];

export interface EstimateCostOutput {
  pages: number | null;
  estimated_credits: number;
  current_balance: number;
  sufficient: boolean;
  shortfall: number;
  recommendation: string;
}

/**
 * Credit cost rule (§5.7):
 *   parse           → pages × 2
 *   parse_translate → pages × 3
 *   translate       → pages × 2
 *   convert         → 1 (page count ignored)
 */
export function estimateCredits(operation: Operation, pages: number): number {
  switch (operation) {
    case "parse":
      return pages * 2;
    case "parse_translate":
      return pages * 3;
    case "translate":
      return pages * 2;
    case "convert":
      return 1;
  }
}

export function buildRecommendation(shortfall: number): string {
  return shortfall > 0
    ? `Need top-up at https://www.kolmopdf.com/subscription (short by ${shortfall} credits).`
    : "Sufficient";
}

export async function estimateCostHandler(
  _args: EstimateCostInput,
  _ctx: ToolContext,
): Promise<McpSuccessResult> {
  throw new Error("not_implemented: estimateCostHandler");
}

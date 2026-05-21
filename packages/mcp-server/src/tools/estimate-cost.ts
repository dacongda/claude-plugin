import { resolve } from "node:path";
import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";
import { jsonResult } from "../context.js";
import { readPageCount } from "../pages.js";

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
  args: EstimateCostInput,
  ctx: ToolContext,
): Promise<McpSuccessResult> {
  const client = ctx.getClient();

  let pages: number | null = null;
  if (args.operation !== "convert") {
    const filePath = resolve(args.file_path);
    pages = await readPageCount(filePath);
  }

  const estimatedCredits = estimateCredits(args.operation, pages ?? 1);
  const balance = await client.getBalance();
  const currentBalance = balance.points;
  const shortfall = Math.max(0, estimatedCredits - currentBalance);

  const output: EstimateCostOutput = {
    pages,
    estimated_credits: estimatedCredits,
    current_balance: currentBalance,
    sufficient: shortfall === 0,
    shortfall,
    recommendation: buildRecommendation(shortfall),
  };

  return jsonResult(output as unknown as Record<string, unknown>);
}

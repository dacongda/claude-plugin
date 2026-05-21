/**
 * Tool: kolmopdf_convert_markdown (DEVELOPMENT.md §5.6).
 * Markdown (or zip) → DOCX/HTML/PDF/LaTeX. submit → poll → download.
 * NOTE: scaffold — handler implemented in M2.
 */
import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";

export const convertName = "kolmopdf_convert_markdown";

export const convertDescription =
  "Convert a Markdown file (or a ZIP of markdown + images) to DOCX, HTML, PDF, " +
  "or LaTeX via KolmoPDF.";

export const convertInputSchema = z.object({
  file_path: z
    .string()
    .describe("Path to a .md/.markdown file or .zip containing markdown + images."),
  target_format: z.enum(["word", "docx", "html", "pdf", "latex", "tex"]).optional().default("word"),
  output_subdir: z.string().optional(),
});

export type ConvertInput = z.infer<typeof convertInputSchema>;

export interface ConvertOutput {
  task_id: string;
  points_deducted: number;
  remaining_points: number;
  output: {
    output_path: string;
    target_format: string;
  };
}

/** Map a requested target_format onto the output file extension (§5.6). */
export function formatToExtension(targetFormat: string): string {
  switch (targetFormat) {
    case "word":
    case "docx":
      return ".docx";
    case "html":
      return ".html";
    case "pdf":
      return ".pdf";
    case "latex":
    case "tex":
      return ".tex";
    default:
      return ".out";
  }
}

/** Normalize a requested target_format to the canonical extension-less name. */
export function normalizeFormat(targetFormat: string): string {
  switch (targetFormat) {
    case "word":
    case "docx":
      return "docx";
    case "latex":
    case "tex":
      return "tex";
    default:
      return targetFormat;
  }
}

export async function convertHandler(
  _args: ConvertInput,
  _ctx: ToolContext,
): Promise<McpSuccessResult> {
  throw new Error("not_implemented: convertHandler");
}

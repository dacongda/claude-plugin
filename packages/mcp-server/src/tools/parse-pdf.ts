/**
 * Tool: kolmopdf_parse_pdf (DEVELOPMENT.md §5.4).
 * submit → poll → download → unzip, all inside one tool call.
 * NOTE: scaffold — handler implemented in M2.
 */
import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";

export const parsePdfName = "kolmopdf_parse_pdf";

export const parsePdfDescription =
  "Parse a local PDF into Markdown via KolmoPDF. Handles formulas, tables, " +
  "multi-column layouts, and code blocks. Optionally translates while parsing.";

export const parsePdfInputSchema = z.object({
  file_path: z.string().describe("Absolute or cwd-relative path to a local PDF file."),
  table_mode: z.enum(["markdown", "image"]).optional(),
  formula_format: z.enum(["dollar", "bracket"]).optional(),
  enable_translation: z.boolean().optional(),
  target_language: z.enum(["zh", "en", "ja", "ko", "fr", "de", "es", "ru"]).optional(),
  output_options: z.array(z.enum(["original", "translated", "bilingual"])).optional(),
  images_as_url: z.boolean().optional(),
  skip_rotation_detection: z.boolean().optional(),
  enable_cross_page_merge: z.boolean().optional(),
  output_subdir: z
    .string()
    .optional()
    .describe("Subdirectory name under KOLMOPDF_OUTPUT_DIR. Defaults to <task_id>."),
});

export type ParsePdfInput = z.infer<typeof parsePdfInputSchema>;

export interface ParsePdfOutput {
  task_id: string;
  pages_parsed: number;
  points_deducted: number;
  remaining_points: number;
  output: {
    type: "zip_extracted" | "markdown_file";
    markdown_path: string;
    images_dir: string | null;
    output_root: string;
  };
  preview: string;
}

export async function parsePdfHandler(
  _args: ParsePdfInput,
  _ctx: ToolContext,
): Promise<McpSuccessResult> {
  throw new Error("not_implemented: parsePdfHandler");
}

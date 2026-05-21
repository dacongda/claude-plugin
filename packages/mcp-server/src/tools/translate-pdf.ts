/**
 * Tool: kolmopdf_translate_pdf (DEVELOPMENT.md §5.5).
 * Layout-preserving PDF translation. submit → poll → download (no unzip).
 * NOTE: scaffold — handler implemented in M2.
 */
import { z } from "zod";
import type { McpSuccessResult, ToolContext } from "../context.js";

export const translatePdfName = "kolmopdf_translate_pdf";

export const translatePdfDescription =
  "Translate a PDF while preserving its original layout via KolmoPDF. " +
  "Produces a translated PDF (optionally side-by-side bilingual).";

export const translatePdfInputSchema = z.object({
  file_path: z.string(),
  source_language: z.string().optional().default("en"),
  target_language: z.string().optional().default("zh"),
  layout_modes: z
    .array(z.enum(["translated_only", "side_by_side"]))
    .optional()
    .default(["translated_only"]),
  enable_image_translation: z.boolean().optional().default(false),
  enable_table_translation: z.boolean().optional().default(false),
  output_subdir: z.string().optional(),
});

export type TranslatePdfInput = z.infer<typeof translatePdfInputSchema>;

export interface TranslatePdfOutput {
  task_id: string;
  pages_translated: number;
  points_deducted: number;
  remaining_points: number;
  output: {
    translated_pdf_path: string;
  };
}

export async function translatePdfHandler(
  _args: TranslatePdfInput,
  _ctx: ToolContext,
): Promise<McpSuccessResult> {
  throw new Error("not_implemented: translatePdfHandler");
}

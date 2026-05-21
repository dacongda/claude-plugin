/**
 * ZIP extraction helper using yauzl (DEVELOPMENT.md §5.4 step 5).
 *
 * Extracts a downloaded ZIP into <OUTPUT_DIR>/<task_id>/ and identifies the
 * first *.md file as the canonical markdown path.
 * NOTE: scaffold — implemented in M2.
 */

export interface ExtractResult {
  /** Absolute path to the first *.md file found in the archive. */
  markdownPath: string | null;
  /** Absolute path to the images/ directory if present, else null. */
  imagesDir: string | null;
  /** Absolute path to the extraction root. */
  outputRoot: string;
  /** All extracted file paths (absolute). */
  files: string[];
}

/** Extract a ZIP file at `zipPath` into `destDir`. */
export async function extractZip(_zipPath: string, _destDir: string): Promise<ExtractResult> {
  throw new Error("not_implemented: extractZip");
}

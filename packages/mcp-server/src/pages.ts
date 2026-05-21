/**
 * Local PDF page-count + size pre-checks (DEVELOPMENT.md §5.4 steps 1-2).
 *
 * Uses pdf-lib only to read the page count before upload, so we can reject
 * over-limit files locally without spending credits.
 * NOTE: scaffold — implemented in M2.
 */

export const MAX_PAGES = 800;
export const MAX_FILE_BYTES = 300 * 1024 * 1024; // 300MB

/** Read the page count of a local PDF via pdf-lib. */
export async function readPageCount(_filePath: string): Promise<number> {
  throw new Error("not_implemented: readPageCount");
}

/** Returns the file size in bytes via fs.stat. */
export async function readFileSize(_filePath: string): Promise<number> {
  throw new Error("not_implemented: readFileSize");
}

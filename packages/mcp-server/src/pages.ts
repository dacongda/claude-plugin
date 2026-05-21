import { readFile, stat } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";

export const MAX_PAGES = 800;
export const MAX_FILE_BYTES = 300 * 1024 * 1024;

export async function readPageCount(filePath: string): Promise<number> {
  const data = await readFile(filePath);
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function readFileSize(filePath: string): Promise<number> {
  const s = await stat(filePath);
  return s.size;
}

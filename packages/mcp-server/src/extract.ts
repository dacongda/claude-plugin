import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { type Entry, type ZipFile, open as yauzlOpen } from "yauzl";

export interface ExtractResult {
  markdownPath: string | null;
  imagesDir: string | null;
  outputRoot: string;
  files: string[];
}

export async function extractZip(zipPath: string, destDir: string): Promise<ExtractResult> {
  mkdirSync(destDir, { recursive: true });

  const zipFile = await openZip(zipPath);
  const files: string[] = [];
  let markdownPath: string | null = null;
  let imagesDir: string | null = null;

  for await (const entry of iterEntries(zipFile)) {
    const entryPath = join(destDir, entry.fileName);

    if (entry.fileName.endsWith("/")) {
      mkdirSync(entryPath, { recursive: true });
      if (entry.fileName.includes("images")) {
        imagesDir = entryPath;
      }
      continue;
    }

    mkdirSync(dirname(entryPath), { recursive: true });
    const readStream = await openReadStream(zipFile, entry);
    const writeStream = createWriteStream(entryPath);
    await pipeline(readStream, writeStream);
    files.push(entryPath);

    if (!markdownPath && /\.md$/i.test(entry.fileName)) {
      markdownPath = entryPath;
    }
    if (!imagesDir && /images\//i.test(entry.fileName)) {
      const prefix = entry.fileName.split("images/")[0] ?? "";
      imagesDir = join(destDir, prefix, "images");
    }
  }

  return { markdownPath, imagesDir, outputRoot: destDir, files };
}
function openZip(path: string): Promise<ZipFile> {
  return new Promise((resolve, reject) => {
    yauzlOpen(path, { lazyEntries: true }, (err, zf) => {
      if (err || !zf) return reject(err ?? new Error("Failed to open zip"));
      resolve(zf);
    });
  });
}

async function* iterEntries(zipFile: ZipFile): AsyncGenerator<Entry> {
  let resolve: ((entry: Entry | null) => void) | null = null;
  const queue: (Entry | null)[] = [];

  zipFile.on("entry", (entry: Entry) => {
    if (resolve) {
      const r = resolve;
      resolve = null;
      r(entry);
    } else {
      queue.push(entry);
    }
  });
  zipFile.on("end", () => {
    if (resolve) {
      const r = resolve;
      resolve = null;
      r(null);
    } else {
      queue.push(null);
    }
  });

  zipFile.readEntry();
  while (true) {
    const entry =
      queue.length > 0
        ? (queue.shift() as Entry | null)
        : await new Promise<Entry | null>((r) => {
            resolve = r;
          });
    if (entry === null) break;
    yield entry;
    zipFile.readEntry();
  }
}

function openReadStream(zipFile: ZipFile, entry: Entry): Promise<NodeJS.ReadableStream> {
  return new Promise((resolve, reject) => {
    zipFile.openReadStream(entry, (err, stream) => {
      if (err || !stream) return reject(err ?? new Error("Failed to open entry stream"));
      resolve(stream);
    });
  });
}

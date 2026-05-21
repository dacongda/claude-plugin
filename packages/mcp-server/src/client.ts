/**
 * KolmoPDF HTTP API client (DEVELOPMENT.md §5.12).
 *
 * Auth uses the `X-API-Key` header (never URL params, to avoid log leakage).
 * NOTE: scaffold — method bodies are stubbed and implemented in milestone M1.
 */
import type { Writable } from "node:stream";

export interface KolmoPdfClientOptions {
  apiKey: string;
  baseUrl: string;
  httpTimeoutMs: number;
  uploadTimeoutMs: number;
}

export interface ParseForm {
  table_mode?: "markdown" | "image";
  formula_format?: "dollar" | "bracket";
  enable_translation?: boolean;
  target_language?: string;
  output_options?: string[];
  images_as_url?: boolean;
  skip_rotation_detection?: boolean;
  enable_cross_page_merge?: boolean;
}

export interface TranslateForm {
  source_language?: string;
  target_language?: string;
  layout_modes?: Array<"translated_only" | "side_by_side">;
  enable_image_translation?: boolean;
  enable_table_translation?: boolean;
}

export interface ConvertForm {
  target_format?: string;
}

export type TaskStatus = "pending" | "waiting" | "processing" | "completed" | "failed";

export interface SubmitResult {
  task_id: string;
  status: TaskStatus | string;
  points_deducted: number;
  remaining_points: number;
  queue_info?: { position: number; ahead_tasks: number };
}

export interface StatusResult {
  success: boolean;
  status: TaskStatus | string;
  message?: string;
  queue_info?: { position: number; ahead_tasks: number };
  error_code?: string;
  result?: { task_id: string; download_url: string };
}

export interface DownloadMeta {
  contentType: string | null;
  /** true when the payload is a ZIP archive (parse default), false for a single file. */
  isZip: boolean;
  bytesWritten: number;
}

export interface BalanceResult {
  success: boolean;
  points: number;
  api_key: string;
}

export type FileInput = Buffer | NodeJS.ReadableStream;

export class KolmoPdfClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly httpTimeoutMs: number;
  private readonly uploadTimeoutMs: number;

  constructor(opts: KolmoPdfClientOptions) {
    this.apiKey = opts.apiKey;
    this.baseUrl = opts.baseUrl;
    this.httpTimeoutMs = opts.httpTimeoutMs;
    this.uploadTimeoutMs = opts.uploadTimeoutMs;
  }

  /** Endpoint base path shared by every route. */
  protected get apiBase(): string {
    return `${this.baseUrl}/api/pdf-to-markdown-proxy`;
  }

  async parse(_file: FileInput, _form: ParseForm, _filename: string): Promise<SubmitResult> {
    throw new Error("not_implemented: KolmoPdfClient.parse");
  }

  async translatePdf(
    _file: FileInput,
    _form: TranslateForm,
    _filename: string,
  ): Promise<SubmitResult> {
    throw new Error("not_implemented: KolmoPdfClient.translatePdf");
  }

  async convert(_file: FileInput, _form: ConvertForm, _filename: string): Promise<SubmitResult> {
    throw new Error("not_implemented: KolmoPdfClient.convert");
  }

  async getStatus(_taskId: string): Promise<StatusResult> {
    throw new Error("not_implemented: KolmoPdfClient.getStatus");
  }

  async download(_taskId: string, _dest: Writable): Promise<DownloadMeta> {
    throw new Error("not_implemented: KolmoPdfClient.download");
  }

  async getBalance(): Promise<BalanceResult> {
    throw new Error("not_implemented: KolmoPdfClient.getBalance");
  }
}

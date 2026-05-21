import type { Writable } from "node:stream";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { KolmoPdfError, errorFromApiBody } from "./errors.js";

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

  private get apiBase(): string {
    return `${this.baseUrl}/api/pdf-to-markdown-proxy`;
  }

  private headers(): Record<string, string> {
    return { "X-API-Key": this.apiKey };
  }

  private async jsonRequest(url: string, init: RequestInit): Promise<unknown> {
    const res = await fetch(url, init);
    const body = (await res.json()) as Record<string, unknown>;
    if (!res.ok || body.success === false) {
      throw errorFromApiBody(
        body as {
          error_code?: string;
          message?: string;
          points_required?: number;
          current_points?: number;
        },
        res.status,
      );
    }
    return body;
  }

  private async buildFileForm(file: FileInput, filename: string): Promise<FormData> {
    const form = new FormData();
    let blob: Blob;
    if (Buffer.isBuffer(file)) {
      blob = new Blob([file]);
    } else {
      const chunks: Buffer[] = [];
      for await (const chunk of file) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      blob = new Blob([Buffer.concat(chunks)]);
    }
    form.append("file", blob, filename);
    return form;
  }

  async parse(file: FileInput, form: ParseForm, filename: string): Promise<SubmitResult> {
    const fd = await this.buildFileForm(file, filename);
    if (form.table_mode) fd.append("table_mode", form.table_mode);
    if (form.formula_format) fd.append("formula_format", form.formula_format);
    if (form.enable_translation !== undefined)
      fd.append("enable_translation", String(form.enable_translation));
    if (form.target_language) fd.append("target_language", form.target_language);
    if (form.output_options?.length) fd.append("output_options", form.output_options.join(","));
    if (form.images_as_url !== undefined) fd.append("images_as_url", String(form.images_as_url));
    if (form.skip_rotation_detection !== undefined)
      fd.append("skip_rotation_detection", String(form.skip_rotation_detection));
    if (form.enable_cross_page_merge !== undefined)
      fd.append("enable_cross_page_merge", String(form.enable_cross_page_merge));

    const body = await this.jsonRequest(`${this.apiBase}/parse`, {
      method: "POST",
      headers: this.headers(),
      body: fd,
      signal: AbortSignal.timeout(this.uploadTimeoutMs),
    });
    return body as unknown as SubmitResult;
  }

  async translatePdf(
    file: FileInput,
    form: TranslateForm,
    filename: string,
  ): Promise<SubmitResult> {
    const fd = await this.buildFileForm(file, filename);
    if (form.source_language) fd.append("sourceLanguage", form.source_language);
    if (form.target_language) fd.append("targetLanguage", form.target_language);
    if (form.layout_modes?.length) fd.append("layoutModes", form.layout_modes.join(","));
    if (form.enable_image_translation !== undefined)
      fd.append("enableImageTranslation", String(form.enable_image_translation));
    if (form.enable_table_translation !== undefined)
      fd.append("enableTableTranslation", String(form.enable_table_translation));

    const body = await this.jsonRequest(`${this.apiBase}/translate-pdf`, {
      method: "POST",
      headers: this.headers(),
      body: fd,
      signal: AbortSignal.timeout(this.uploadTimeoutMs),
    });
    return body as unknown as SubmitResult;
  }

  async convert(file: FileInput, form: ConvertForm, filename: string): Promise<SubmitResult> {
    const fd = await this.buildFileForm(file, filename);
    if (form.target_format) fd.append("targetFormat", form.target_format);

    const body = await this.jsonRequest(`${this.apiBase}/convert`, {
      method: "POST",
      headers: this.headers(),
      body: fd,
      signal: AbortSignal.timeout(this.uploadTimeoutMs),
    });
    return body as unknown as SubmitResult;
  }

  async getStatus(taskId: string): Promise<StatusResult> {
    const body = await this.jsonRequest(`${this.apiBase}/status/${taskId}`, {
      method: "GET",
      headers: this.headers(),
      signal: AbortSignal.timeout(this.httpTimeoutMs),
    });
    return body as unknown as StatusResult;
  }

  async download(taskId: string, dest: Writable): Promise<DownloadMeta> {
    const res = await fetch(`${this.apiBase}/download/${taskId}`, {
      method: "GET",
      headers: this.headers(),
      signal: AbortSignal.timeout(this.uploadTimeoutMs),
    });
    if (!res.ok) {
      throw new KolmoPdfError("api_task_error", {
        message: `Download failed with HTTP ${res.status}`,
        httpStatus: res.status,
      });
    }
    const contentType = res.headers.get("content-type");
    const isZip = contentType?.includes("zip") || contentType?.includes("octet-stream") || false;
    const body = res.body;
    if (!body) {
      throw new KolmoPdfError("api_task_error", { message: "Empty download response body" });
    }

    const reader = body.getReader();
    let bytesWritten = 0;

    async function* generate() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytesWritten += value.byteLength;
        yield Buffer.from(value);
      }
    }

    const readable = Readable.from(generate());
    await pipeline(readable, dest);
    return { contentType, isZip, bytesWritten };
  }

  async getBalance(): Promise<BalanceResult> {
    const body = await this.jsonRequest(`${this.apiBase}/balance`, {
      method: "GET",
      headers: this.headers(),
      signal: AbortSignal.timeout(this.httpTimeoutMs),
    });
    return body as unknown as BalanceResult;
  }
}

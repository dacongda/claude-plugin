/**
 * Task polling state machine + retry policy (DEVELOPMENT.md §5.10).
 *
 * NOTE: scaffold — `pollUntilComplete` is stubbed and implemented in M1.
 */
import type { KolmoPdfClient, StatusResult } from "./client.js";
import type { ProgressReporter } from "./progress.js";

export interface PollOptions {
  pollIntervalMs: number;
  maxPollMinutes: number;
}

/** Terminal + transient status partitioning used by the state machine. */
export const TERMINAL_OK = "completed";
export const TERMINAL_FAIL = "failed";
export const IN_FLIGHT_STATUSES = new Set(["pending", "waiting", "processing"]);

/** Exponential backoff retry policy for transient network/5xx errors (§5.10). */
export const RETRY_POLICY = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  factor: 2,
} as const;

export function backoffDelayMs(attempt: number): number {
  return RETRY_POLICY.baseDelayMs * RETRY_POLICY.factor ** (attempt - 1);
}

/** Whether a transient error should be retried (network errors / 5xx). */
export function isRetryable(err: { httpStatus?: number | null; code?: string }): boolean {
  const transientCodes = ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "EAI_AGAIN"];
  if (err.code && transientCodes.includes(err.code)) return true;
  if (typeof err.httpStatus === "number" && err.httpStatus >= 500) return true;
  return false;
}

export interface PollContext {
  client: KolmoPdfClient;
  taskId: string;
  options: PollOptions;
  progress?: ProgressReporter;
}

/**
 * Poll `/status/{task_id}` until completion, emitting progress each tick.
 * Resolves with the final completed StatusResult, or throws KolmoPdfError.
 */
export async function pollUntilComplete(_ctx: PollContext): Promise<StatusResult> {
  throw new Error("not_implemented: pollUntilComplete");
}

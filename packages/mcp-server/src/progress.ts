/**
 * MCP progress-notification helper (DEVELOPMENT.md §5.11).
 *
 * `progress` must be monotonically increasing; `total` is omitted because the
 * API does not provide a precise percentage.
 */

/** Minimal shape of the MCP request context used to emit notifications. */
export interface ProgressSink {
  /** Present only when the client supplied a progressToken in request `_meta`. */
  progressToken?: string | number;
  notify(notification: {
    method: "notifications/progress";
    params: {
      progressToken: string | number;
      progress: number;
      message?: string;
    };
  }): Promise<void>;
}

/** Stateful emitter that guarantees a monotonically increasing counter. */
export class ProgressReporter {
  private counter = 0;

  constructor(private readonly sink: ProgressSink | undefined) {}

  async report(message: string): Promise<void> {
    if (!this.sink || this.sink.progressToken === undefined) return;
    this.counter += 1;
    await this.sink.notify({
      method: "notifications/progress",
      params: {
        progressToken: this.sink.progressToken,
        progress: this.counter,
        message,
      },
    });
  }
}

/** Build a human-readable status line, e.g. "[waiting] 3 tasks ahead". */
export function humanizeStatus(status: string, aheadTasks?: number): string {
  if (status === "waiting" && typeof aheadTasks === "number") {
    return `[waiting] ${aheadTasks} tasks ahead`;
  }
  return `[${status}]`;
}

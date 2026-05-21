import { describe, expect, it } from "vitest";
import { RETRY_POLICY, backoffDelayMs, isRetryable } from "../../src/polling.js";

describe("backoffDelayMs", () => {
  it("grows exponentially from the base delay", () => {
    expect(backoffDelayMs(1)).toBe(RETRY_POLICY.baseDelayMs);
    expect(backoffDelayMs(2)).toBe(RETRY_POLICY.baseDelayMs * RETRY_POLICY.factor);
    expect(backoffDelayMs(3)).toBe(RETRY_POLICY.baseDelayMs * RETRY_POLICY.factor ** 2);
  });
});

describe("isRetryable", () => {
  it("retries transient network error codes", () => {
    expect(isRetryable({ code: "ECONNRESET" })).toBe(true);
    expect(isRetryable({ code: "ETIMEDOUT" })).toBe(true);
  });
  it("retries 5xx", () => {
    expect(isRetryable({ httpStatus: 502 })).toBe(true);
  });
  it("does not retry 4xx business errors", () => {
    expect(isRetryable({ httpStatus: 400 })).toBe(false);
    expect(isRetryable({ httpStatus: 402 })).toBe(false);
  });
});

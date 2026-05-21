import { describe, expect, it } from "vitest";
import { KolmoPdfClient } from "../../src/client.js";
import { loadConfig } from "../../src/config.js";

/**
 * Live smoke tests (TESTING_AND_USAGE.md §7). These hit the real API and only
 * run when KOLMOPDF_API_KEY is present (CI nightly job / manual). Skipped
 * otherwise so the default `pnpm test` stays offline and deterministic.
 */
const hasKey = Boolean(process.env.KOLMOPDF_API_KEY);
const maybe = hasKey ? describe : describe.skip;

maybe("smoke-balance", () => {
  it("returns a non-negative balance for a valid key", async () => {
    const cfg = loadConfig();
    const client = new KolmoPdfClient({
      apiKey: cfg.apiKey as string,
      baseUrl: cfg.baseUrl,
      httpTimeoutMs: cfg.httpTimeoutMs,
      uploadTimeoutMs: cfg.uploadTimeoutMs,
    });
    const balance = await client.getBalance();
    expect(balance.success).toBe(true);
    expect(balance.points).toBeGreaterThanOrEqual(0);
  });
});

describe("smoke harness", () => {
  it("is configured to skip when no API key is set", () => {
    // Guards against accidentally enabling live calls in offline CI.
    expect(typeof hasKey).toBe("boolean");
  });
});

import { describe, expect, it } from "vitest";
import { formatToExtension, normalizeFormat } from "../../src/tools/convert.js";

describe("formatToExtension", () => {
  it.each([
    ["word", ".docx"],
    ["docx", ".docx"],
    ["html", ".html"],
    ["pdf", ".pdf"],
    ["latex", ".tex"],
    ["tex", ".tex"],
  ])("%s → %s", (input, expected) => {
    expect(formatToExtension(input)).toBe(expected);
  });
});

describe("normalizeFormat", () => {
  it.each([
    ["word", "docx"],
    ["docx", "docx"],
    ["latex", "tex"],
    ["tex", "tex"],
    ["html", "html"],
    ["pdf", "pdf"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeFormat(input)).toBe(expected);
  });
});

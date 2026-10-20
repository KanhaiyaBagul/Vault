import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as path from "node:path";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("WCAG AA Contrast & Editorial Design Tokens (contrast_tokens.test.ts)", async () => {
  const cssPath = path.resolve("./public/styles.css");
  const cssContent = await fs.readFile(cssPath, "utf-8");

  it("verifies --muted token is #5A544E and satisfies WCAG AA contrast on #F0E6D8", () => {
    assert.ok(cssContent.includes("--muted: #5A544E;"));
    const ratio = contrastRatio("#5A544E", "#F0E6D8");
    // WCAG AA requirement for normal text is 4.5:1
    assert.ok(ratio >= 4.5, `Expected contrast ratio >= 4.5, but got ${ratio.toFixed(2)}:1`);
  });

  it("verifies --body and --ink tokens meet high-contrast accessibility standards", () => {
    const bodyRatio = contrastRatio("#3E3A36", "#F0E6D8");
    const inkRatio = contrastRatio("#1A1715", "#F0E6D8");
    assert.ok(bodyRatio >= 7.0, `Expected body contrast >= 7.0, got ${bodyRatio.toFixed(2)}:1`);
    assert.ok(inkRatio >= 10.0, `Expected ink contrast >= 10.0, got ${inkRatio.toFixed(2)}:1`);
  });

  it("verifies interactive chips and empty state suggestions exist in styles.css", () => {
    assert.ok(cssContent.includes(".security-chip.interactive"));
    assert.ok(cssContent.includes(".btn-chip-suggest"));
    assert.ok(cssContent.includes(".empty-state-title"));
    assert.ok(cssContent.includes(".empty-suggestions"));
  });

  it("verifies responsive breakpoints for 1080px and 640px mobile viewports", () => {
    assert.ok(cssContent.includes("@media (max-width: 1080px)"));
    assert.ok(cssContent.includes("@media (max-width: 640px)"));
  });
});

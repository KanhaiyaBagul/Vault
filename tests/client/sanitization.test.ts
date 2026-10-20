/**
 * Search Highlighter & Input Sanitization Test Suite
 * Tests escapeHtml, escapeRegex, and highlightTermsSafe against XSS vectors and regex metacharacters.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  escapeHtml,
  escapeRegex,
  highlightTermsSafe,
} from "../../public/app.js";

describe("Search Highlighter & Sanitization Core", () => {
  it("escapes all dangerous HTML entity characters", () => {
    const raw = `<script>alert('XSS & "breach"')</script>`;
    const escaped = escapeHtml(raw);
    assert.equal(
      escaped,
      "&lt;script&gt;alert(&#039;XSS &amp; &quot;breach&quot;&#039;)&lt;/script&gt;"
    );
    assert.equal(escaped.includes("<"), false);
    assert.equal(escaped.includes(">"), false);
  });

  it("escapes regex metacharacters without throwing syntax errors", () => {
    const metaChars = ".*+?^${}()|[]\\";
    const escaped = escapeRegex(metaChars);
    // Should create a valid regex without throwing
    const rx = new RegExp(escaped, "g");
    assert.ok(rx);
    assert.equal(rx.test(metaChars), true);
  });

  it("highlightTermsSafe handles queries with regex metacharacters safely", () => {
    const content = "Tax report for (Q3) and [CONFIDENTIAL] audits.";
    const query = "(Q3) AND [CONFIDENTIAL]";

    // Must not throw RegExp SyntaxError
    const result = highlightTermsSafe(content, query);
    assert.ok(result);
    assert.ok(result.includes("<mark>(Q3)</mark>"));
    assert.ok(result.includes("<mark>[CONFIDENTIAL]</mark>"));
  });

  it("highlightTermsSafe prevents DOM-based XSS injection in content", () => {
    const maliciousContent = `<img src="x" onerror="evil()"/> Hello security audit.`;
    const query = "security";

    const result = highlightTermsSafe(maliciousContent, query);
    // Must NOT contain unescaped HTML tags
    assert.equal(result.includes("<img"), false);
    assert.ok(result.includes("&lt;img"));
    assert.ok(result.includes("<mark>security</mark>"));
  });

  it("highlightTermsSafe handles empty or null inputs gracefully", () => {
    assert.equal(highlightTermsSafe("", "test"), "");
    assert.equal(highlightTermsSafe("content", ""), "content");
    assert.equal(highlightTermsSafe(null as unknown as string, "test"), "");
  });
});

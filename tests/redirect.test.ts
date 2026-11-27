import assert from "node:assert/strict";
import { test } from "node:test";
import { toSafeInternalPath } from "../app/utils/redirect/index.ts";

test("internal paths are preserved with their query and hash", () => {
  assert.equal(
    toSafeInternalPath("/make/session-1/opinions/new?via=swipe#top"),
    "/make/session-1/opinions/new?via=swipe#top",
  );
});

test("empty and missing values do not become a path", () => {
  for (const value of [undefined, null, "", "undefined"]) {
    assert.equal(toSafeInternalPath(value), null);
  }
});

test("external and protocol-relative URLs are rejected", () => {
  for (const value of [
    "https://evil.example/home",
    "http://evil.example",
    "javascript:alert(1)",
    "//evil.example/home",
    "/\\evil.example/home",
    "\\evil.example",
    " /home",
  ]) {
    assert.equal(toSafeInternalPath(value), null);
  }
});

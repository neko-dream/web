import assert from "node:assert/strict";
import { test } from "node:test";

Object.assign(globalThis, { API_URL: "https://api.example.test" });
const { getApiErrorCode, getApiErrorMessage } = await import(
  "../app/libs/openapi-fetch/index.ts"
);

test("getApiErrorCode extracts only string codes", () => {
  assert.equal(getApiErrorCode({ code: "RATE_LIMITED" }), "RATE_LIMITED");
  for (const error of [
    null,
    undefined,
    "code",
    1,
    { code: 1 },
    { code: null },
    {},
  ]) {
    assert.equal(getApiErrorCode(error), undefined);
  }
});

test("getApiErrorMessage falls back when the API has no message", () => {
  assert.equal(
    getApiErrorMessage({ message: "再試行してください" }, "fallback"),
    "再試行してください",
  );
  for (const error of [null, undefined, "message", 1, { message: 1 }, {}]) {
    assert.equal(getApiErrorMessage(error, "fallback"), "fallback");
  }
});

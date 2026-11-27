import assert from "node:assert/strict";
import { test } from "node:test";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { shouldRevalidate } from "../app/routes/_pages.$session_id/modules/shouldRevalidate.ts";

const args = (
  currentSessionID?: string,
  nextSessionID?: string,
  currentUrl = "https://web.example.test/session-1/opinions",
  nextUrl = "https://web.example.test/session-1/opinions",
  defaultShouldRevalidate = false,
): ShouldRevalidateFunctionArgs =>
  ({
    currentParams: currentSessionID ? { session_id: currentSessionID } : {},
    nextParams: nextSessionID ? { session_id: nextSessionID } : {},
    currentUrl: new URL(currentUrl),
    nextUrl: new URL(nextUrl),
    defaultShouldRevalidate,
  }) as ShouldRevalidateFunctionArgs;

test("the same session id does not revalidate when only the tab changes", () => {
  assert.equal(
    shouldRevalidate(
      args(
        "session-1",
        "session-1",
        "https://web.example.test/session-1/opinions",
        "https://web.example.test/session-1/analysis",
      ),
    ),
    false,
  );
});

test("an explicit revalidation on the same URL keeps its default behavior", () => {
  assert.equal(
    shouldRevalidate(
      args("session-1", "session-1", undefined, undefined, true),
    ),
    true,
  );
});

test("a different session id revalidates", () => {
  assert.equal(shouldRevalidate(args("session-1", "session-2")), true);
});

test("missing session ids keep the default revalidation behavior", () => {
  assert.equal(shouldRevalidate(args(undefined, undefined)), true);
  assert.equal(shouldRevalidate(args("session-1", undefined)), true);
  assert.equal(shouldRevalidate(args(undefined, "session-2")), true);
});

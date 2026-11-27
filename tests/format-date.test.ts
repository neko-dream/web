import assert from "node:assert/strict";
import { test } from "node:test";
import { toScheduledEndTime } from "../app/utils/format-date/index.ts";

test("a date-only session end is stored as the end of that day in JST", () => {
  assert.equal(toScheduledEndTime("2026-12-01"), "2026-12-01T14:59:59.999Z");
});

test("an invalid session end is rejected instead of throwing", () => {
  assert.equal(toScheduledEndTime("not-a-date"), null);
  assert.equal(toScheduledEndTime(undefined), null);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import * as v from "valibot";
import { createDynamicSchema } from "../app/routes/_pages.make.$session_id.demographics/schema/index.ts";

const restriction = (key: string, required: boolean) => ({
  key: `demographics.${key}`,
  description: key,
  required,
});

test("birth restriction controls the dateOfBirth field name used by the form", () => {
  const schema = createDynamicSchema([
    restriction("gender", true),
    restriction("birth", false),
    restriction("prefecture", false),
    restriction("city", false),
  ]);

  const result = v.safeParse(schema, {
    gender: "男性",
  });
  assert.equal(result.success, true);
});

test("a required birth restriction still requires dateOfBirth", () => {
  const schema = createDynamicSchema([restriction("birth", true)]);

  const result = v.safeParse(schema, {});
  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(
      result.issues.some((issue) => issue.path?.[0]?.key === "dateOfBirth"),
    );
  }
});

test("fields without a required restriction are optional", () => {
  const schema = createDynamicSchema([
    restriction("gender", false),
    restriction("birth", false),
    restriction("prefecture", false),
    restriction("city", false),
  ]);

  assert.equal(v.safeParse(schema, {}).success, true);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import * as v from "valibot";
import {
  signupFormSchema,
  signupFormWithEmailSchema,
} from "../app/routes/_pages.auth.signup/schemas/index.ts";
import { createSessionFormSchema } from "../app/routes/_pages.make.$session_id._index/schemas/index.ts";
import { schema as messageSchema } from "../app/routes/_pages.make.$session_id.message/schemas/index.ts";
import { createOpinionFormSchema } from "../app/schemas/create-opinion/index.ts";
import { genderSchema } from "../app/schemas/users/index.ts";

test("createSessionFormSchema requires a five-character theme and an end date", () => {
  assert.equal(
    v.safeParse(createSessionFormSchema, {
      theme: "五文字です",
      scheduledEndTime: "2026-12-01",
    }).success,
    true,
  );

  const shortTheme = v.safeParse(createSessionFormSchema, {
    theme: "短い",
    scheduledEndTime: "2026-12-01",
  });
  assert.equal(shortTheme.success, false);
  assert.equal(
    shortTheme.issues?.[0]?.message,
    "テーマは5文字以上で入力してください",
  );

  const missingDate = v.safeParse(createSessionFormSchema, {
    theme: "五文字です",
  });
  assert.equal(missingDate.success, false);
});

test("createSessionFormSchema converts hideTop strings to booleans", () => {
  const parse = (hideTop: unknown) => {
    const result = v.safeParse(createSessionFormSchema, {
      theme: "五文字です",
      scheduledEndTime: "2026-12-01",
      hideTop,
    });
    assert.equal(result.success, true);
    return result.success ? result.output.hideTop : undefined;
  };

  assert.equal(parse("true"), true);
  assert.equal(parse("false"), false);
  assert.equal(parse("1"), false);
  assert.equal(parse(undefined), undefined);
});

test("signupFormSchema requires an alphanumeric display ID and keeps email optional", () => {
  assert.equal(
    v.safeParse(signupFormSchema, {
      displayID: "user123",
      displayName: "テストユーザー",
    }).success,
    true,
  );

  const invalidID = v.safeParse(signupFormSchema, {
    displayID: "user_123",
    displayName: "テストユーザー",
  });
  assert.equal(invalidID.success, false);
  assert.equal(invalidID.issues?.[0]?.message, "半角英数字で入力してください");

  const missingID = v.safeParse(signupFormSchema, {
    displayID: undefined,
    displayName: "テストユーザー",
  });
  assert.equal(missingID.success, false);
  assert.equal(missingID.issues?.[0]?.message, "ユーザーIDの入力は必須です");
});

test("signupFormWithEmailSchema requires an email field", () => {
  assert.equal(
    v.safeParse(signupFormWithEmailSchema, {
      displayID: "user123",
      displayName: "テストユーザー",
      email: "user@example.com",
    }).success,
    true,
  );

  const missingEmail = v.safeParse(signupFormWithEmailSchema, {
    displayID: "user123",
    displayName: "テストユーザー",
    email: undefined,
  });
  assert.equal(missingEmail.success, false);
  assert.equal(
    missingEmail.issues?.[0]?.message,
    "メールアドレスの入力は必須です",
  );
});

test("genderSchema only accepts the supported options", () => {
  for (const value of ["男性", "女性", "その他"]) {
    assert.equal(v.safeParse(genderSchema, value).success, true);
  }
  assert.equal(v.safeParse(genderSchema, "不明").success, false);
});

test("message schema requires at least two characters", () => {
  assert.equal(v.safeParse(messageSchema, { content: "ok" }).success, true);

  const tooShort = v.safeParse(messageSchema, { content: "a" });
  assert.equal(tooShort.success, false);
  assert.equal(
    tooShort.issues?.[0]?.message,
    "メッセージは2文字以上で入力してください",
  );
});

test("createOpinionFormSchema caps content at 140 characters", () => {
  assert.equal(
    v.safeParse(createOpinionFormSchema, {
      opinionContent: "あ".repeat(140),
    }).success,
    true,
  );

  const tooLong = v.safeParse(createOpinionFormSchema, {
    opinionContent: "あ".repeat(141),
  });
  assert.equal(tooLong.success, false);
  assert.equal(tooLong.issues?.[0]?.message, "140文字以内で入力してください");
});

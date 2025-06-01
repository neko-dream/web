import * as v from "valibot";
import { genderSchema } from "~/schemas/users";

const alphanumericSchema = v.regex(
  /^[a-zA-Z0-9]*$/,
  "半角英数字で入力してください",
);

const baseSchema = v.object({
  displayName: v.string("ユーザー名の入力は必須です"),
  city: v.optional(v.string()),
  prefecture: v.optional(v.string()),
  icon: v.optional(v.instance(File)),
  gender: v.optional(genderSchema),
  dateOfBirth: v.optional(v.string()),
});

export const signupFormSchema = v.object({
  displayID: v.pipe(v.string("ユーザーIDの入力は必須です"), alphanumericSchema),
  email: v.optional(v.string()),
  ...baseSchema.entries,
});

export const signupFormWithEmailSchema = v.object({
  displayID: v.pipe(v.string("ユーザーIDの入力は必須です"), alphanumericSchema),
  email: v.string("メールアドレスの入力は必須です"),
  ...baseSchema.entries,
});

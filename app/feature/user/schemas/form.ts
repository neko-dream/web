import * as v from "valibot";
import { str2num } from "~/schemas/str2num";

const alphanumericSchema = v.regex(
  /^[a-zA-Z0-9]*$/,
  "半角英数字で入力してください",
);

const genderSchema = v.optional(
  v.union([
    v.literal("男性"),
    v.literal("女性"),
    v.literal("その他"),
    v.literal("---"),
  ]),
);

const baseSchema = v.object({
  displayName: v.string("ユーザー名の入力は必須です"),
  city: v.optional(v.string()),
  prefecture: v.optional(v.string()),
  icon: v.optional(v.instance(File)),
  gender: v.optional(genderSchema),
  yearOfBirth: str2num,
});

export const adressFormSchema = v.object({
  city: v.optional(v.string()),
  prefecture: v.optional(v.string()),
});

export const userEditFormSchema = v.object({
  ...baseSchema.entries,
  ...adressFormSchema.entries,
});

export const signupFormSchema = v.object({
  displayID: v.pipe(v.string("ユーザーIDの入力は必須です"), alphanumericSchema),
  email: v.optional(v.string()),
  ...baseSchema.entries,
  ...adressFormSchema.entries,
});

export const singupFormWithEmailSchema = v.object({
  displayID: v.pipe(v.string("ユーザーIDの入力は必須です"), alphanumericSchema),
  email: v.string("メールアドレスの入力は必須です"),
  ...baseSchema.entries,
  ...adressFormSchema.entries,
});

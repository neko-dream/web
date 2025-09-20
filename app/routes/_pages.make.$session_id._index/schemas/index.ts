import * as v from "valibot";

export const createSessionFormSchema = v.object({
  theme: v.pipe(
    v.string("テーマの入力は必須です"),
    v.minLength(5, "テーマは5文字以上で入力してください"),
  ),
  scheduledEndTime: v.string("終了日時の入力は必須です"),
  description: v.optional(v.string()),
  restrictions: v.optional(v.union([v.array(v.string()), v.string()])),
  hideTop: v.optional(
    v.pipe(
      v.string(), // HTMLからは文字列として受け取る
      v.transform((value) => value === "true"), // "true" → true, それ以外 → false
    ),
  ),
});

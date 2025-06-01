import * as v from "valibot";

export const genderSchema = v.union([
  v.literal("男性"),
  v.literal("女性"),
  v.literal("その他"),
]);

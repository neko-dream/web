import { instance, object, optional, string } from "valibot";
import { genderSchema } from "~/schemas/users";

export const userEditSchema = object({
  displayName: string("ユーザー名の入力は必須です"),
  city: optional(string()),
  prefecture: optional(string()),
  icon: optional(instance(File)),
  gender: optional(genderSchema),
  dateOfBirth: optional(string()),
});

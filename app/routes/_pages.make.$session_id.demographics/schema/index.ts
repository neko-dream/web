import * as v from "valibot";

const genderSchema = v.union([
  v.literal("男性"),
  v.literal("女性"),
  v.literal("その他"),
]);

export const baseSchema = v.object({
  city: v.string("市町村の入力は必須です"),
  prefecture: v.string("都道府県の入力は必須です"),
  gender: genderSchema,
  dateOfBirth: v.string("誕生日の入力は必須です"),
});

/**
 * requestRestrictionsに基づいて動的にスキーマを作成する関数
 */
export const createDynamicSchema = (
  requestRestrictions: Array<{
    key: string;
    description: string;
    required: boolean;
  }>,
) => {
  const newSchema = {
    ...baseSchema.entries,
  };

  for (const restriction of requestRestrictions) {
    const fieldName = restriction.key.replace(
      "demographics.",
      "",
    ) as keyof typeof newSchema;

    if (!restriction.required && newSchema[fieldName]) {
      newSchema[fieldName] = v.optional(newSchema[fieldName]) as never;
    }
  }

  return v.object(newSchema);
};

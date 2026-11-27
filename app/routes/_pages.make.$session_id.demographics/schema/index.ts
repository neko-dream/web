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
 * 制限キーとフォームフィールドの対応。
 * API側の誕生日キーは `birth` だが、フォームでは `dateOfBirth` を使う。
 */
const FIELD_BY_RESTRICTION_KEY: Record<
  string,
  keyof typeof baseSchema.entries
> = {
  birth: "dateOfBirth",
  gender: "gender",
  city: "city",
  prefecture: "prefecture",
};

/**
 * requestRestrictionsに基づいて動的にスキーマを作成する関数。
 * 明示的にrequiredになった項目だけを必須にし、それ以外は任意にする。
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

  const requiredFields = new Set<keyof typeof newSchema>();
  for (const restriction of requestRestrictions) {
    if (!restriction.required) {
      continue;
    }
    const restrictionKey = restriction.key.replace(/^demographics\./, "");
    const fieldName = FIELD_BY_RESTRICTION_KEY[restrictionKey];
    if (fieldName) {
      requiredFields.add(fieldName);
    }
  }

  for (const fieldName of Object.keys(newSchema) as Array<
    keyof typeof newSchema
  >) {
    if (!requiredFields.has(fieldName)) {
      newSchema[fieldName] = v.optional(newSchema[fieldName]) as never;
    }
  }

  return v.object(newSchema);
};

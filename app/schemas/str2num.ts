import * as v from "valibot";

/**
 * string を number に変換するスキーマ
 * @description string が数値に変換できない場合は undefined を返す
 */
export const str2num = v.pipe(
  v.optional(v.string()),
  v.transform((str) => {
    const num = Number(str);
    if (Number.isNaN(num)) {
      return undefined;
    }
    return num;
  }),
  v.optional(v.number()),
);

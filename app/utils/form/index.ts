import municipality from "~/assets/data/adress/municipality.json";

/**
 * 存在する市町村かどうかを判定する型ガード
 */
export const isCity = (value?: string): value is keyof typeof municipality => {
  if (!value) {
    return false;
  }
  return value in municipality;
};

/**
 * conform で使用してるフィールドにエラーがあるかどうかを判定する型ガード
 */
export const isFieldsError = (error?: unknown): error is string[] => {
  if (!Array.isArray(error)) {
    return false;
  }
  return error.every((e) => typeof e === "string");
};

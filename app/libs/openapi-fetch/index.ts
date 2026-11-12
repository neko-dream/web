import createClient from "openapi-fetch";
import type { paths } from "~/types/openapi";

/**
 * objectを適切な形式に変換する
 */
const convertFormData = (params: object): URLSearchParams | FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "undefined") {
      continue;
    }
    if (value === "") {
      continue;
    }

    formData.append(key, value);
  }
  return formData;
};

/**
 * APIクライアント
 *
 * SPAではloaderもブラウザで実行されるため、Cookie認証は
 * SSR時のヘッダー転送ではなく credentials: "include" で送る。
 */
export const api = createClient<paths>({
  baseUrl: API_URL,
  credentials: "include",
  bodySerializer: (body) => body && convertFormData(body),
  fetch: (init) => {
    // TODO: なぜかついているとAPIが404を返す
    init.headers.delete("host");

    return fetch(init, {
      headers: init.headers,
    });
  },
});

/**
 * OpenAPI定義にエラーレスポンスのbodyがない場合、openapi-fetchの error は {} になる。
 * 実行時に code / message を持つ場合だけ安全に取り出す。
 */
export const getApiErrorCode = (error: unknown): string | undefined => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
};

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
 */
export const api = createClient<paths>({
  baseUrl: API_URL,
  bodySerializer: (body) => body && convertFormData(body),
  fetch: (init) => {
    // TODO: なぜかついているとAPIが404を返す
    init.headers.delete("host");

    return fetch(init, {
      headers: init.headers,
    });
  },
});

import createClient from "openapi-fetch";
import type { paths } from "~/types/openapi";

// SSR forwards the request cookies directly to the local HTTP API. Browser
// requests use the HTTPS Web proxy, so no self-signed TLS bypass is needed.
declare const LOCAL_API_URL: string;

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
  baseUrl: import.meta.env.SSR && LOCAL_API_URL ? LOCAL_API_URL : API_URL,
  bodySerializer: (body) => body && convertFormData(body),
  fetch: (init) => {
    // TODO: なぜかついているとAPIが404を返す
    init.headers.delete("host");

    return fetch(init, {
      headers: init.headers,
    });
  },
});

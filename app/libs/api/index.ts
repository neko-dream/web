import createClient from "openapi-fetch";
import { paths } from "./openapi";

/**
 * objectをFormDataに変換する
 */
const convertFormData = (params: object): FormData => {
  const formData = new FormData();

  for (const [k, v] of Object.entries(params)) {
    const value = typeof v === "number" ? String(v) : v;

    if (value) {
      formData.append(k, value);
    }
  }

  return formData;
};

/**
 * APIクライアント
 */
export const api = createClient<paths>({
  baseUrl: API_BASE_URL,
  bodySerializer: (body) => body && convertFormData(body),
  fetch: async (init) => {
    const headers = new Headers(init.headers);

    /**
     * ReactRouterV7はundiciを使うようになっています。
     * ブラウザからのリクエストを全て付け替えてるのでそこにzstdが入ってる？
     * ただundiciはzstdに対応していなく文字化けしてしまいます。
     * https://github.com/nodejs/undici/issues/2847
     */
    headers.set("accept-encoding", "gzip");

    return fetch(init, {
      headers,
    });
  },
});

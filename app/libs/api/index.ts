import createClient from "openapi-fetch";
import type { paths } from "~/types/openapi";

/**
 * objectを適切な形式に変換する
 */
const convertFormData = (params: object): URLSearchParams | FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, `${value}`);
    }
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
    const headers = new Headers(init.headers);

    /**
     * ReactRouterV7はundiciを使うようになっています。
     * ブラウザからのリクエストを全て付け替えてるのでそこにzstdが入ってる？
     * ただundiciはzstdに対応していなく文字化けしてしまいます。
     * https://github.com/nodejs/undici/issues/2847
     */
    headers.set("accept-encoding", "gzip");

    return fetch(init, { headers });
  },
});

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
    return fetch(init, {
      headers: {
        cookie: init.headers?.get("cookie") || "",
      },
    });
  },
});

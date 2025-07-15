import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

import createClient from "openapi-fetch";
import type { paths } from "~/types/openapi";

/**
 * objectを適切な形式に変換する
 */
const convertFormData = (params: object): URLSearchParams | FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, value);
    }
  }
  return formData;
};

/**
 * APIクライアント
 */
 const apiWithTimeout = createClient<paths>({
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

    return fetch(init, { 
      headers,
      signal: AbortSignal.timeout(3000)
    });
  },
});


export const loader = ({ params, request }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const $reports = apiWithTimeout.GET("/talksessions/{talkSessionID}/report", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  }).catch((e) => {
    console.log(e)
    return {
      data: {
        report: null,
      }
    }
  });

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  return {
    $positions,
    $reports,
  };
};

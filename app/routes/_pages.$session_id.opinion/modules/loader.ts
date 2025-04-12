import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = ({ params, request }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const $user = api.GET("/auth/token/info", {
    headers: request.headers,
  });

  const $opinions = api.GET("/talksessions/{talkSessionID}/opinions", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const $reasons = api.GET("/opinions/report_reasons", {
    headers: request.headers,
  });

  const $position = api.GET("/talksessions/{talkSessionID}/analysis", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  return { $opinions, $reasons, $user, $position };
};

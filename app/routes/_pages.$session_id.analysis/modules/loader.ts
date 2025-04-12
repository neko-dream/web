import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = ({ params, request }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const $reports = api.GET("/talksessions/{talkSessionID}/report", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const $opinions = api.GET("/talksessions/{talkSessionID}/opinions", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
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
    $opinions,
    $reports,
  };
};

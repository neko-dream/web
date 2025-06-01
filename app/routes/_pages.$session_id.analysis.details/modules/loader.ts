import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = ({ params, request }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const $session = api.GET("/talksessions/{talkSessionID}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id || "",
      },
    },
  });

  const $reports = api.GET("/talksessions/{talkSessionID}/report", {
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
    $session,
    $reports,
  };
};

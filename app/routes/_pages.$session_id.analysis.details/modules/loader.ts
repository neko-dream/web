import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const $session = api.GET("/talksessions/{talkSessionID}", {
    params: {
      path: {
        talkSessionID: params.session_id || "",
      },
    },
  });

  const $reports = api.GET("/talksessions/{talkSessionID}/report", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", {
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

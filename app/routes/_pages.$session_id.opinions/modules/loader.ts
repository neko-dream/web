import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const $user = api.GET("/auth/token/info");

  const $opinions = api.GET("/talksessions/{talkSessionID}/opinions", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
      query: {
        limit: 1000,
      },
    },
  });

  const $reasons = api.GET("/opinions/report_reasons");

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  return { $opinions, $reasons, $user, $positions };
};

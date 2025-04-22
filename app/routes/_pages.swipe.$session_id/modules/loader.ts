import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { forbidden, notfound } from "~/libs/response";
import { OPINIONS_LIMIT } from "../constants";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const { data: session } = await api.GET("/talksessions/{talkSessionID}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id || "",
      },
    },
  });

  const { data: opinions, error } = await api.GET(
    "/talksessions/{talkSessionID}/swipe_opinions",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.session_id,
        },
        query: {
          limit: OPINIONS_LIMIT,
        },
      },
    },
  );

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  if (!(opinions && session) || error) {
    if (error?.code.includes("AUTH")) {
      throw forbidden();
    }

    throw notfound();
  }

  return {
    ...opinions,
    session,
    $positions,
  };
};

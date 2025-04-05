import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const { data: session } = await api.GET("/talksessions/{talkSessionID}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const { data: user } = await api.GET("/auth/token/info", {
    headers: request.headers,
  });

  const { data: report } = await api.GET(
    "/talksessions/{talkSessionID}/report",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    },
  );

  if (!session) {
    throw notfound();
  }

  return {
    session,
    user,
    report,
  };
};

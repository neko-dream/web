import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { data: session } = await api.GET("/talksessions/{talkSessionId}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionId: params.session_id || "",
      },
    },
  });

  const { data: user } = await api.GET("/auth/token/info", {
    headers: request.headers,
  });

  const { data: report } = await api.GET(
    "/talksessions/{talkSessionId}/report",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionId: params.session_id!,
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

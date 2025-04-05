import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const { data: session } = await api.GET("/talksessions/{talkSessionId}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionId: params.session_id || "",
      },
    },
  });

  const { data } = await api.GET("/talksessions/{talkSessionId}/report", {
    headers: request.headers,
    params: {
      path: {
        talkSessionId: params.session_id,
      },
    },
  });

  const { data: position } = await api.GET(
    "/talksessions/{talkSessionId}/analysis",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionId: params.session_id,
        },
      },
    },
  );

  return {
    position,
    session,
    report: data?.report,
  };
};

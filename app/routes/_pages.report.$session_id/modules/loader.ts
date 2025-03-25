import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
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
        talkSessionId: params.session_id!,
      },
    },
  });

  const { data: position } = await api.GET(
    "/talksessions/{talkSessionId}/analysis",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionId: params.session_id!,
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

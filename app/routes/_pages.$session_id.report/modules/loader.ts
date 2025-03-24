import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
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

  const { data } = await api.GET("/talksessions/{talkSessionID}/opinions", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id!,
      },
    },
  });

  if (!data?.opinions) {
    return notfound();
  }

  return {
    opinions: data?.opinions,
    report,
  };
};

import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const { data } = await api.GET("/talksessions/{talkSessionId}/analysis", {
    headers: request.headers,
    params: {
      path: {
        talkSessionId: params.session_id,
      },
    },
  });

  const { data: timeline } = await api.GET(
    "/talksessions/{talkSessionID}/timelines",
    {
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    },
  );

  const { data: conclusion } = await api.GET(
    "/talksessions/{talkSessionID}/conclusion",
    {
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    },
  );

  const { data: opinions } = await api.GET(
    "/talksessions/{talkSessionID}/opinions",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.id || "",
        },
        query: {
          // FIXME: 無限スクロールに対応する
          limit: 100000,
        },
      },
    },
  );

  const { data: report } = await api.GET(
    "/talksessions/{talkSessionId}/report",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionId: params.id || "",
        },
      },
    },
  );

  return {
    data,
    opinions,
    report,
    timeline,
    conclusion,
  };
};

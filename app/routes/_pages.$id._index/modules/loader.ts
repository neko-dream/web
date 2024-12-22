import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { data } = await api.GET("/talksessions/{talkSessionId}/analysis", {
    headers: request.headers,
    params: {
      path: {
        talkSessionId: params.id || "",
      },
    },
  });

  const { data: timeline } = await api.GET(
    "/talksessions/{talkSessionID}/timelines",
    {
      params: {
        path: {
          talkSessionID: params.id!,
        },
      },
    },
  );

  const { data: conclusion } = await api.GET(
    "/talksessions/{talkSessionID}/conclusion",
    {
      params: {
        path: {
          talkSessionID: params.id!,
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

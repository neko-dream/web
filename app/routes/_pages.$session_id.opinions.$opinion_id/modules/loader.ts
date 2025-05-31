import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!(params.opinion_id && params.session_id)) {
    return notfound();
  }

  const [
    { data: session },
    { data: root },
    {
      data: { opinions } = { opinions: [] },
    },
    { data: currentUser },
  ] = await Promise.all([
    api.GET("/talksessions/{talkSessionID}", {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    }),
    api.GET("/opinions/{opinionID}", {
      headers: request.headers,
      params: {
        path: {
          opinionID: params.opinion_id,
        },
      },
    }),
    api.GET("/opinions/{opinionID}/replies", {
      headers: request.headers,
      params: {
        path: {
          opinionID: params.opinion_id,
        },
      },
    }),
    api.GET("/auth/token/info", {
      headers: request.headers,
    }),
  ]);

  if (!(root && opinions && session)) {
    return notfound();
  }

  return {
    root,
    currentUser,
    session,
    opinions,
  };
};

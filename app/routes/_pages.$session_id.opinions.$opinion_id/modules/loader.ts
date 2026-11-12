import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (!(params.opinion_id && params.session_id)) {
    return notfound();
  }

  const [
    { data: session },
    { data: root },
    { data: { opinions } = { opinions: [] } },
    { data: currentUser },
  ] = await Promise.all([
    api.GET("/talksessions/{talkSessionID}", {
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    }),
    api.GET("/opinions/{opinionID}", {
      params: {
        path: {
          opinionID: params.opinion_id,
        },
      },
    }),
    api.GET("/opinions/{opinionID}/replies", {
      params: {
        path: {
          opinionID: params.opinion_id,
        },
      },
    }),
    api.GET("/auth/token/info"),
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

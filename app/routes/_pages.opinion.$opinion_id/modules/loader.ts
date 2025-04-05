import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!params.opinion_id) {
    return notfound();
  }

  const { data: root } = await api.GET("/opinions/{opinionID}", {
    headers: request.headers,
    params: {
      path: {
        opinionID: params.opinion_id,
      },
    },
  });

  const { data: opinions } = await api.GET("/opinions/{opinionID}/replies", {
    headers: request.headers,
    params: {
      path: {
        opinionID: params.opinion_id,
      },
    },
  });

  const { data: currentUser } = await api.GET("/auth/token/info", {
    headers: request.headers,
  });

  if (!(root && opinions)) {
    return notfound();
  }

  return {
    root,
    currentUser,
    opinions: opinions.opinions,
  };
};

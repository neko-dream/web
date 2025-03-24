import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { data: opinion } = await api.GET("/opinions/{opinionID}", {
    headers: request.headers,
    params: {
      path: {
        opinionID: params.opinion_id!,
      },
    },
  });

  const { data: opinions } = await api.GET("/opinions/{opinionID}/replies", {
    headers: request.headers,
    params: {
      path: {
        opinionID: params.opinion_id!,
      },
    },
  });

  if (!opinion || !opinions) {
    return notfound();
  }

  return {
    ...opinion,
    opinions: opinions.opinions,
  };
};

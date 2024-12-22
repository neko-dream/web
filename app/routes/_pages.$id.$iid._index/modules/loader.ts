import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { data: user } = await api.GET("/auth/token/info", {
    headers: request.headers,
  });

  const { data } = await api.GET(
    "/talksessions/{talkSessionID}/opinions/{opinionID}/replies",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.id!,
          opinionID: params.iid!,
        },
      },
    },
  );

  if (!data) {
    return notfound();
  }

  if (data.rootOpinion?.opinion.parentID) {
    const { data: parentOpinion } = await api.GET(
      "/talksessions/{talkSessionID}/opinions/{opinionID}/replies",
      {
        headers: request.headers,
        params: {
          path: {
            talkSessionID: params.id!,
            opinionID: data.rootOpinion.opinion.parentID!,
          },
        },
      },
    );

    return {
      ...data,
      user,
      parentOpinion,
      rootOpinion: data?.rootOpinion,
      opinions: data?.opinions.reverse(),
    };
  }

  return {
    ...data,
    user,
    parentOpinion: undefined,
    rootOpinion: data?.rootOpinion,
    opinions: data?.opinions.reverse(),
  };
};

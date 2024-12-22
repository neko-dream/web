import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

export const loader = async ({ params }: LoaderFunctionArgs) => {
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

  return {
    timeline: timeline?.items || [],
    conclusion,
  };
};

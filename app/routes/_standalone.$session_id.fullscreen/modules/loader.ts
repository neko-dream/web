import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const props = {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  };

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", props);
  const $reports = api.GET("/talksessions/{talkSessionID}/report", props);
  const { data: session } = await api.GET(
    "/talksessions/{talkSessionID}",
    props,
  );

  if (!session) {
    return notfound();
  }

  return { session, $positions, $reports };
};

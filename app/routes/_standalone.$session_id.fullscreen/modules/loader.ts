import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const props = {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  };

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", props);
  const { data: session } = await api.GET(
    "/talksessions/{talkSessionID}",
    props,
  );

  if (!session) {
    return notfound();
  }

  return { session, $positions };
};

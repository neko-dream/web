import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    return notfound();
  }

  const $opinions = api.GET("/talksessions/{talkSessionID}/opinions", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
      query: {
        limit: 1000,
        seed: true,
      },
    },
  });

  return {
    $opinions,
  };
};

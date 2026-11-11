import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const $message = api
    .GET("/talksessions/{talkSessionID}/conclusion", {
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    })
    .then(({ data }) => data);

  return {
    $message,
  };
};

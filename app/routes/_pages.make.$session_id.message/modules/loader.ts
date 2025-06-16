import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const [{ data: session }, { data: message }] = await Promise.all([
    api.GET("/talksessions/{talkSessionID}", {
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    }),
    api.GET("/talksessions/{talkSessionID}/conclusion", {
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    }),
  ]);

  if (!session) {
    throw notfound();
  }

  return {
    session,
    message,
  };
};

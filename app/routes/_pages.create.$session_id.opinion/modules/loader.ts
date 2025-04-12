import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { data: session } = await api.GET("/talksessions/{talkSessionID}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id || "",
      },
    },
  });

  if (!session) {
    throw notfound();
  }

  return {
    session,
  };
};

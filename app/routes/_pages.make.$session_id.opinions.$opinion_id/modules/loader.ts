import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { data: session } = await api.GET("/talksessions/{talkSessionID}", {
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

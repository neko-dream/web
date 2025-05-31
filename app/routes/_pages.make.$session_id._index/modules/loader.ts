import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { data: restrictions } = await api.GET("/talksessions/restrictions", {
    headers: request.headers,
  });

  if (params.session_id === "new") {
    return {
      restrictions,
    };
  }

  if (!params.session_id) {
    throw notfound();
  }

  const { data: session } = await api.GET("/talksessions/{talkSessionID}", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  if (!session) {
    throw notfound();
  }

  return {
    isEditMode: true,
    session,
    restrictions,
  };
};

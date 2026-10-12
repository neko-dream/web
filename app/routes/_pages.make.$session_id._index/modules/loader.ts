import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { requireSessionCreationPermission } from "~/libs/session-creation";
import { notfound } from "~/utils/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (params.session_id === "new") {
    requireSessionCreationPermission(
      await api.GET("/users/me", { headers: request.headers }),
    );
    return {};
  }

  if (!params.session_id) {
    throw notfound();
  }

  const $session = api.GET("/talksessions/{talkSessionID}", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const $survey = api.GET("/talksessions/{talkSessionID}/survey", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const [{ data: session }, { data: survey }] = await Promise.all([
    $session,
    $survey,
  ]);

  if (!session) {
    throw notfound();
  }

  return {
    isEditMode: true,
    session,
    survey,
  };
};

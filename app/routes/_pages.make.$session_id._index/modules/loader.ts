import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const $restrictions = api.GET("/talksessions/restrictions", {
    headers: request.headers,
  });

  if (params.session_id === "new") {
    const { data: restrictions } = await $restrictions;
    return {
      restrictions,
    };
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

  const [{ data: restrictions }, { data: session }, { data: survey }] =
    await Promise.all([$restrictions, $session, $survey]);

  if (!session) {
    throw notfound();
  }

  return {
    isEditMode: true,
    session,
    restrictions,
    survey,
  };
};

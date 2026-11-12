import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { requireSessionCreationPermission } from "~/libs/session-creation";
import { notfound } from "~/utils/response";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (params.session_id === "new") {
    const result = await api.GET("/users/me").catch((error) => {
      console.error("セッション作成権限の取得に失敗しました", error);
      throw new Response("作成権限を確認できませんでした", { status: 503 });
    });
    requireSessionCreationPermission(result);
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

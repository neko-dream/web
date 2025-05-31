import { type LoaderFunctionArgs, redirect } from "react-router";
import { api } from "~/libs/api";
import { forbidden, notfound } from "~/libs/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const next = new URL(request.url).searchParams.get("next");

  const { data } = await api.GET("/user", {
    headers: request.headers,
  });

  if (!data?.user) {
    throw forbidden();
  }

  /**
   * 制限項目の中で足りていない項目を取得
   */
  const { data: requiredRestrictions } = await api.GET(
    "/talksessions/{talkSessionID}/restrictions",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    },
  );

  const { data: restrictions } = await api.GET("/talksessions/restrictions", {
    headers: request.headers,
  });

  if (!(requiredRestrictions && restrictions)) {
    throw notfound();
  }

  if (requiredRestrictions?.length === 0) {
    throw redirect(`/${params.session_id}`);
  }

  // 足りていない項目リスト
  const requiredKeys = requiredRestrictions.map(({ key }) => key);

  const requestRestrictions = restrictions.map((restriction) => {
    return {
      ...restriction,
      required: requiredKeys.includes(restriction.key),
    };
  });

  return {
    ...data,
    requestRestrictions,
    sessionID: params.session_id,
    next,
  };
};

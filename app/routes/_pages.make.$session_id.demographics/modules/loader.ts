import { type LoaderFunctionArgs, redirect } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { forbidden, notfound } from "~/utils/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const next = new URL(request.url).searchParams.get("next");

  const [{ data }, { data: requiredRestrictions }, { data: restrictions }] =
    await Promise.all([
      api.GET("/user", {
        headers: request.headers,
      }),
      api.GET("/talksessions/{talkSessionID}/restrictions", {
        headers: request.headers,
        params: {
          path: {
            talkSessionID: params.session_id,
          },
        },
      }),
      api.GET("/talksessions/restrictions", {
        headers: request.headers,
      }),
    ]);

  if (!data?.user) {
    throw forbidden();
  }

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

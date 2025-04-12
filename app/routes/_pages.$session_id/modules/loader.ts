import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const { data: session } = await api.GET("/talksessions/{talkSessionID}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const $remainingCount = await api
    .GET("/talksessions/{talkSessionID}/swipe_opinions", {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    })
    .then(({ data }) => {
      return data?.remainingCount;
    });

  const { data: user } = await api.GET("/auth/token/info", {
    headers: request.headers,
  });

  const { data: report } = await api.GET(
    "/talksessions/{talkSessionID}/report",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    },
  );

  /**
   * 制限項目の中で足りていない項目を取得
   */
  const $restrictionsRequired = api.GET(
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

  /**
   * 制限項目リストの配列の中に足りていないフラグを仕込む処理
   */
  const $restrictions = $restrictionsRequired.then(
    async ({ data: requiredRestrictions }) => {
      const { data: restrictions } = await api.GET(
        "/talksessions/restrictions",
        {
          headers: request.headers,
        },
      );
      // 制限項目がなければ制限するものはない
      if (!restrictions) {
        return [];
      }
      const requiredKeys = requiredRestrictions?.map(({ key }) => key);
      return restrictions?.map((restriction) => {
        return {
          ...restriction,
          required: requiredKeys?.includes(restriction.key),
        };
      });
    },
  );

  if (!session) {
    throw notfound();
  }

  return {
    session,
    user,
    report,
    $remainingCount,
    $restrictions,
  };
};

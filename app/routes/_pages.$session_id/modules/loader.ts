import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const $session = api.GET("/talksessions/{talkSessionID}", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const $remainingCount = api
    .GET("/talksessions/{talkSessionID}/swipe_opinions", {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    })
    .then(({ data }) => {
      return data?.remainingCount || 0;
    });

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

  const $restrictionsList = api.GET("/talksessions/restrictions", {
    headers: request.headers,
  });

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  /**
   * 制限項目リストの配列の中に足りていないフラグを仕込む処理
   */
  const $restrictions = Promise.all([$restrictionsRequired, $restrictionsList]).then(
    ([{ data: requiredRestrictions }, { data: restrictions }]) => {
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

  return {
    $session,
    $remainingCount,
    $restrictions,
    $positions,
  };
};

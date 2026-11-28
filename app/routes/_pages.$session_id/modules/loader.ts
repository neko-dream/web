import type { ClientLoaderFunctionArgs } from "react-router";
import { ENABLE_SURVEY } from "~/constants";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const enableSurvey = ENABLE_SURVEY;

  const $session = api.GET("/talksessions/{talkSessionID}", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  const $remainingCount = api
    .GET("/talksessions/{talkSessionID}/swipe_opinions", {
      params: {
        path: {
          talkSessionID: params.session_id,
        },
      },
    })
    .then(({ data }) => {
      return data?.remainingCount || 0;
    });

  const $positions = api.GET("/talksessions/{talkSessionID}/analysis", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
    },
  });

  /**
   * 入室前アンケート（未設定なら404でnull）
   */
  const $survey = enableSurvey
    ? api
        .GET("/talksessions/{talkSessionID}/survey", {
          params: {
            path: {
              talkSessionID: params.session_id,
            },
          },
        })
        .then(({ data }) => data || null)
        .catch(() => null)
    : Promise.resolve(null);

  return {
    $session,
    $remainingCount,
    $positions,
    $survey,
    enableSurvey,
  };
};

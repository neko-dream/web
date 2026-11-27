import type { ClientLoaderFunctionArgs } from "react-router";
import { api, getApiErrorMessage } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

type ReportTab = "unsolved" | "hold" | "deleted";

const toReportTab = (value: string | null): ReportTab =>
  value === "hold" || value === "deleted" ? value : "unsolved";

export const clientLoader = async ({
  request,
  params,
}: ClientLoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  const query = toReportTab(new URL(request.url).searchParams.get("q"));
  const {
    data: reports,
    error,
    response,
  } = await api.GET("/talksessions/{talkSessionID}/reports", {
    params: {
      path: {
        talkSessionID: params.session_id,
      },
      query: {
        status: query,
      },
    },
  });

  if (error || !reports) {
    throw new Response(
      getApiErrorMessage(error, "通報一覧の取得に失敗しました"),
      { status: response.ok ? 502 : response.status },
    );
  }

  return { ...reports, defaultTab: query };
};

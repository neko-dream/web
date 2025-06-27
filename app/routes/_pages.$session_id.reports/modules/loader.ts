import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.session_id) {
    throw notfound();
  }

  try {
    let query = new URL(request.url).searchParams.get("q") as
      | "unsolved"
      | "hold"
      | "deleted";

    if (!query) {
      query = "unsolved";
    }

    const { data: reports } = await api.GET(
      "/talksessions/{talkSessionID}/reports",
      {
        headers: request.headers,
        params: {
          path: {
            talkSessionID: params.session_id,
          },
          query: {
            status: query,
          },
        },
      },
    );

    return { ...reports, defaultTab: query };
  } catch {
    return {
      reports: [],
      defaultTab: "unsolved" as "unsolved" | "hold" | "deleted",
    };
  }
};

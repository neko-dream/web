import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";

const setTheme = (requestURL: string) => {
  try {
    const query = new URL(requestURL).searchParams.get("q");
    if (query !== "open" && query !== "finished") {
      return query;
    }
  } catch {
    return;
  }
};

export const clientLoader = ({ request }: ClientLoaderFunctionArgs) => {
  const theme = setTheme(request.url);

  const $session = api
    .GET("/talksessions", {
      params: {
        query: {
          status: theme ? undefined : "open",
          theme,
          limit: 100,
        },
      },
    })
    .then((res) => res?.data || null)
    .catch((error) => {
      console.error("セッション一覧の取得に失敗しました", error);
      return null;
    });

  const $closeSession = api
    .GET("/talksessions", {
      params: {
        query: {
          status: "finished",
          limit: 100,
        },
      },
    })
    .then((res) => res?.data || null)
    .catch((error) => {
      console.error("終了済みセッションの取得に失敗しました", error);
      return null;
    });

  return { $session, $closeSession, theme };
};

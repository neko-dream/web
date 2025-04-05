import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

const setStatus = (requestURL: string) => {
  try {
    const query = new URL(requestURL).searchParams.get("q");
    if (query === "open" || query === "finished") {
      return query;
    }
  } catch {
    return;
  }
};

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

export const loader = ({ request }: LoaderFunctionArgs) => {
  const $session = api
    .GET("/talksessions", {
      headers: request.headers,
      params: {
        query: {
          status: setStatus(request.url),
          theme: setTheme(request.url),
          limit: 100,
        },
      },
    })
    .then((res) => res?.data || null);

  // FIXME: 最初だけ
  const $closeSession = api
    .GET("/talksessions", {
      headers: request.headers,
      params: {
        query: {
          status: "finished",
          limit: 100,
        },
      },
    })
    .then((res) => res?.data || null);

  return { $session, $closeSession };
};

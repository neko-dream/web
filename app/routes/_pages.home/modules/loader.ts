import { LoaderFunctionArgs } from "react-router";
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
        },
      },
    })
    .then((res) => res?.data || null);

  $session.then(console.log);

  return { $session };
};

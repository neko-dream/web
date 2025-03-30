import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const $session = await api.GET("/talksessions/opened", {
    headers: request.headers,
    params: {
      query: {
        limit: 100,
      },
    },
  });

  return {
    $session,
  };
};

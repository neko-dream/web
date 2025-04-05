import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const $opinions = await api.GET("/opinions/histories", {
    headers: request.headers,
  });

  return {
    $opinions,
  };
};

import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const $user = api
    .GET("/auth/token/info", {
      headers: request.headers,
    })
    .then((res) => res?.data || null)
    .catch(console.error);

  return { $user };
};

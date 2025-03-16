import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const $user = api
    .GET("/auth/token/info", {
      headers: request.headers,
    })
    .then((res) => res?.data || null)
    .catch(console.error);

  return { $user };
};

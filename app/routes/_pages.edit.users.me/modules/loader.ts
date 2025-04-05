import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { forbidden } from "~/libs/response";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { data } = await api.GET("/user", {
    headers: request.headers,
  });

  if (!data?.user) {
    throw forbidden();
  }

  return {
    user: data.user,
  };
};

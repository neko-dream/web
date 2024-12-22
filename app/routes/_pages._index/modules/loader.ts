import { LoaderFunctionArgs, redirect } from "react-router";
import { api } from "~/libs/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { data } = await api.GET("/auth/token/info", {
    headers: request.headers,
  });

  if (data) {
    throw redirect("/home");
  }

  return {};
};

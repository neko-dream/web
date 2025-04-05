import { type LoaderFunctionArgs, redirect } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { data } = await api.GET("/auth/token/info", {
    headers: request.headers,
  });

  if (!data) {
    throw notfound();
  }

  // 認証済みなら /home にリダイレクト
  if (data?.isRegistered) {
    throw redirect("/home");
  }

  return { ...data };
};

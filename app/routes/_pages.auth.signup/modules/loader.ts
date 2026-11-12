import { redirect } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = async () => {
  const { data } = await api.GET("/auth/token/info");

  if (!data) {
    throw notfound();
  }

  // 認証済みなら /home にリダイレクト
  if (data?.isRegistered) {
    throw redirect("/home");
  }

  return { ...data };
};

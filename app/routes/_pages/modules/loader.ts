import { api } from "~/libs/openapi-fetch";

export const clientLoader = () => {
  const $user = api
    .GET("/auth/token/info")
    .then((res) => res?.data || null)
    .catch((error) => {
      console.error("ユーザー情報の取得に失敗しました", error);
      return null;
    });

  const $permissions = api
    .GET("/users/me")
    .then((res) => res.data?.permissions ?? null)
    .catch((error) => {
      console.error("セッション作成権限の取得に失敗しました", error);
      return null;
    });

  return { $user, $permissions };
};

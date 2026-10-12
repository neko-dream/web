import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const $user = api
    .GET("/auth/token/info", {
      headers: request.headers,
    })
    .then((res) => res?.data || null)
    .catch(console.error);

  const $permissions = api
    .GET("/users/me", { headers: request.headers })
    .then((res) => res.data?.permissions ?? null)
    .catch((error) => {
      // biome-ignore lint/suspicious/noConsole: Server-side failures must remain observable.
      console.error("セッション作成権限の取得に失敗しました", error);
      return null;
    });

  return { $user, $permissions };
};

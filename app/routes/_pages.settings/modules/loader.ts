import { api } from "~/libs/openapi-fetch";
import { forbidden } from "~/utils/response";

export const clientLoader = async () => {
  const [{ data }, { data: tokenInfo }] = await Promise.all([
    api.GET("/user"),
    api.GET("/auth/token/info"),
  ]);

  if (!data?.user) {
    throw forbidden();
  }

  return {
    ...data,
    isGuest: tokenInfo?.isGuest ?? false,
  };
};

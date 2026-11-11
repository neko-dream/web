import { api } from "~/libs/openapi-fetch";
import { forbidden } from "~/utils/response";

export const clientLoader = async () => {
  const { data } = await api.GET("/user");

  if (!data?.user) {
    throw forbidden();
  }

  return data;
};

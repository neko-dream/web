import { api } from "~/libs/openapi-fetch";
import { forbidden } from "~/utils/response";

export const clientLoader = async () => {
  const { data, response } = await api.GET("/user");

  if (!data?.user) {
    if (response.status === 401 || response.status === 403) {
      throw forbidden();
    }
    throw new Response("Failed to load user profile", {
      status: response.ok ? 500 : response.status,
    });
  }

  return {
    user: data.user,
  };
};

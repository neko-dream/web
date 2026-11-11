import { api } from "~/libs/openapi-fetch";

export const clientLoader = async () => {
  const $opinions = await api.GET("/opinions/histories");

  return {
    $opinions,
  };
};

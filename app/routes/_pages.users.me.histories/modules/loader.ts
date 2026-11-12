import { api } from "~/libs/openapi-fetch";

export const clientLoader = async () => {
  const $session = await api.GET("/talksessions/opened", {
    params: {
      query: {
        limit: 100,
      },
    },
  });

  return {
    $session,
  };
};

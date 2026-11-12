import type { ClientLoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.user_id) {
    throw notfound();
  }

  const $user = api.GET("/user/{displayID}", {
    params: {
      path: {
        displayID: params.user_id,
      },
    },
  });

  const $sesssions = api.GET("/users/{displayID}/talksessions", {
    params: {
      path: {
        displayID: params.user_id,
      },
    },
  });

  return {
    $user,
    $sesssions,
  };
};

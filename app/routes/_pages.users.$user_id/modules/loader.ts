import type { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/openapi-fetch";
import { notfound } from "~/utils/response";

export const loader = ({ params, request }: LoaderFunctionArgs) => {
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
    headers: request.headers,
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

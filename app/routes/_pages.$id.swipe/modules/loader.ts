import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { forbidden, notfound } from "~/libs/response";
import { OPINIONS_LIMIT } from "../constants";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const sessionID = params.id!;

  const { data, error } = await api.GET(
    "/talksessions/{talkSessionID}/swipe_opinions",
    {
      headers: request.headers,
      params: {
        path: {
          talkSessionID: sessionID!,
        },
        query: {
          limit: OPINIONS_LIMIT,
        },
      },
    },
  );

  if (!data || error) {
    if (error?.code.includes("AUTH")) {
      throw forbidden();
    }

    throw notfound();
  }

  return { data };
};

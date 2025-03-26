import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";
import { notfound } from "~/libs/response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { data } = await api.GET("/talksessions/{talkSessionID}/opinions", {
    headers: request.headers,
    params: {
      path: {
        talkSessionID: params.session_id!,
      },
    },
  });

  const { data: reasons } = await api.GET("/opinions/report_reasons", {
    headers: request.headers,
  });

  if (!data) {
    return notfound();
  }

  return { opinions: data.opinions, reasons };
};

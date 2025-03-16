import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { data: restrictions } = await api.GET("/talksessions/restrictions", {
    headers: request.headers,
  });

  return {
    restrictions,
  };
};

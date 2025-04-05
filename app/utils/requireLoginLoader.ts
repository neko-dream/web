import type { LoaderFunctionArgs } from "react-router";
import type { User } from "~/features/user/types";
import { api } from "~/libs/api";

/**
 * ログインが必須のページのローダー関数を生成する関数
 */
export const requireLoginLoader = <T extends Record<string, unknown>>(
  callback: (args: LoaderFunctionArgs, user: User) => Promise<T>,
) => {
  return async (args: LoaderFunctionArgs) => {
    const { data } = await api.GET("/user", {
      headers: args.request.headers,
    });
    if (!data) {
      throw new Response("Not Found", {
        status: 404,
      });
    }

    const result = await callback(args, {
      ...data.user,
      ...data.demographics,
    });

    return result;
  };
};

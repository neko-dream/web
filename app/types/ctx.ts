import type { Route } from "~/react-router/_pages.$session_id/+types/route";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type SessionRouteContext = {
  session: Exclude<
    UnwrapPromise<Route.ComponentProps["loaderData"]["$session"]>["data"],
    null | undefined
  >;
};

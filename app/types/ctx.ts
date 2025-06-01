import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import type { User } from ".";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type SessionRouteContext = {
  session: Exclude<
    UnwrapPromise<Route.ComponentProps["loaderData"]["$session"]>["data"],
    null | undefined
  >;
};

export type RouteContext = {
  $user: Promise<User | null | undefined>;
};

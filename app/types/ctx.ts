import type { Route } from "~/react-router/_pages.$session_id/+types/route";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type User = {
  aud: string;
  exp: string;
  iat: string;
  iss: string;
  sub: string;
  jti: string;
  displayID?: string;
  displayName?: string;
  iconURL?: string;
  isRegistered: boolean;
  isEmailVerified: boolean;
};

export type SessionRouteContext = {
  session: Exclude<
    UnwrapPromise<Route.ComponentProps["loaderData"]["$session"]>["data"],
    null | undefined
  >;
};

export type RouteContext = {
  $user: Promise<User | null | undefined>;
};

import type { Route } from "~/react-router/_pages.$session_id/+types/route";

export type SessionRouteContext = Omit<
  Route.ComponentProps["loaderData"],
  "$restrictions" | "$restrictionsRequired"
>;

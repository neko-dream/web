import type { RouteConfig, RouteConfigEntry } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

/**
 * URL的には親子になるルートだけど親子にしたくないルートの列挙
 */
const customRoutes: Array<RouteConfigEntry & { id: string }> = [
  {
    id: "routes/_pages.$session_id.analysis.details",
    file: "routes/_pages.$session_id.analysis.details/index.tsx",
    path: ":session_id/analysis/details",
  },
  {
    id: "routes/_pages.$session_id.opinions.$opinion_id",
    file: "routes/_pages.$session_id.opinions.$opinion_id/index.tsx",
    path: ":session_id/opinions/:opinion_id",
  },
  {
    id: "routes/_pages.users.me.edit",
    file: "routes/_pages.users.me.edit/index.tsx",
    path: "users/me/edit",
  },
];

const routes = await flatRoutes({
  ignoredRouteFiles: customRoutes.map((route) => route.id),
});

const mergedRoute = routes.map((route) => {
  // MEMO: 現状はroutes/_pagesの下に全部入れたい
  if (route.id === "routes/_pages") {
    route.children?.push(...customRoutes);
  }
  return route;
});

export default mergedRoute satisfies RouteConfig;

import type { RouteConfig, RouteConfigEntry } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const ignoreLayoutRoute: RouteConfigEntry[] = [
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
];

/**
 * ルート配列から指定されたパターンにマッチするルートを再帰的に除外する
 */
function filterRoutes(
  routes: Awaited<ReturnType<typeof flatRoutes>>,
  ignorePatterns: RouteConfigEntry[]
): Awaited<ReturnType<typeof flatRoutes>> {
  return routes
    .filter((route) => {
      // ルートのfile pathが除外パターンにマッチするかチェック
      return !ignorePatterns.some((pattern) => {
        return route.file === pattern.file;
      });
    })
    .map((route) => {
      // 子ルートが存在する場合は再帰的に処理
      if (route.children && route.children.length > 0) {
        return {
          ...route,
          children: filterRoutes(route.children, ignorePatterns),
        };
      }
      return route;
    });
}

const filteredRoutes = filterRoutes(await flatRoutes(), ignoreLayoutRoute);

const route = [
  {
    ...filteredRoutes[0],
    children: [...(filteredRoutes[0].children || []), ...ignoreLayoutRoute],
  },
];

export default route satisfies RouteConfig;

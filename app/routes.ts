import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

/**
 * アプリケーションのレイアウト
 * MEMO: トップページには使わないルート
 */
const APP_LAYOUT_ROUTE = "routes/@layout/route.tsx";

export default [
  index("./routes/_index/index.tsx"),
  route("/", APP_LAYOUT_ROUTE, await flatRoutes()),
] satisfies RouteConfig;

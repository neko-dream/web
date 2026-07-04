import {
  RouterContextProvider,
  createContext,
  createRequestHandler,
} from "react-router";

/**
 * v8 ではミドルウェアが既定で有効になり、loader/action には
 * `RouterContextProvider` が渡る。Cloudflare の env / ctx はこの
 * コンテキスト経由で参照する（`context.get(cloudflareContext)`）。
 */
export const cloudflareContext = createContext<{
  env: Env;
  ctx: ExecutionContext;
}>();

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    const context = new RouterContextProvider();
    context.set(cloudflareContext, { env, ctx });
    return requestHandler(request, context);
  },
} satisfies ExportedHandler<Env>;

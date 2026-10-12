import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { type ServerOptions, defineConfig } from "vite";
import { getPlatformProxy } from "wrangler";
import { resolveUrls, selectEnvironment } from "./vite.env";

const apiPrefixPattern = /^\/api(?=\/|$)/;

export default defineConfig(async ({ command }) => {
  // Every build selects an environment explicitly. Local settings are serve-only.
  const cloudflareEnv = process.env.CLOUDFLARE_ENV;
  const localApiUrl = process.env.LOCAL_API_URL;
  const environment = selectEnvironment({
    command,
    cloudflareEnv,
    localApiUrl,
  });
  const proxy = environment
    ? await getPlatformProxy({ environment, remoteBindings: false, envFiles: [] })
    : null;
  let urls: ReturnType<typeof resolveUrls>;
  try {
    urls = resolveUrls(environment, proxy?.env);
  } finally {
    await proxy?.dispose();
  }
  const { APP_URL, API_URL } = urls;

  const server: ServerOptions = {
    host: true,
    port: 3000,
    hmr: {
      host: localApiUrl ? "localhost" : "local.kotohiro.com",
      protocol: "wss",
      clientPort: 3000,
    },
    strictPort: true,
    proxy: localApiUrl
      ? {
          "/api": {
            target: localApiUrl,
            changeOrigin: true,
            rewrite: (path: string) => path.replace(apiPrefixPattern, ""),
          },
        }
      : {},
  };

  return {
    server: cloudflareEnv ? undefined : server,
    define: {
      APP_URL: `${JSON.stringify(APP_URL)}`,
      API_URL: `${JSON.stringify(API_URL)}`,
      LOCAL_API_URL: JSON.stringify(localApiUrl ?? ""),
    },
    resolve: { tsconfigPaths: true },
    plugins: [
      basicSsl({
        name: "kotohiro",
        domains: localApiUrl
          ? ["localhost", "127.0.0.1"]
          : ["local.kotohiro.com"],
        // pnpm install で消えないよう node_modules 外に固定し、
        // 一度ホストのキーチェインに信頼登録すれば再登録不要にする
        certDir: localApiUrl ? ".cert/localhost" : ".cert",
        // ブラウザのTLS有効期限上限(398日)未満。再登録頻度を下げる
        ttlDays: 397,
      }),
      cloudflare({
        viteEnvironment: { name: "ssr" },
        ...(localApiUrl
          ? { configPath: "wrangler.local.toml", remoteBindings: false }
          : {}),
      }),
      reactRouter(),
      tailwindcss(),
    ],
  };
});

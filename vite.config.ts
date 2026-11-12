import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, type ServerOptions } from "vite";
import { resolveUrls, selectEnvironment } from "./vite.env.ts";

const apiPrefixPattern = /^\/api(?=\/|$)/;

export default defineConfig(async ({ command, isPreview }) => {
  // ビルドは必ず環境を明示する。ローカル設定は開発サーバー専用
  const cloudflareEnv = process.env.CLOUDFLARE_ENV;
  const localApiUrl = process.env.LOCAL_API_URL;
  const environment = selectEnvironment({
    command,
    cloudflareEnv,
    localApiUrl,
    branch: process.env.WORKERS_CI_BRANCH,
  });
  const { APP_URL, API_URL } = resolveUrls(environment, {
    APP_URL: process.env.APP_URL,
    API_URL: process.env.API_URL,
  });

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
    server,
    define: {
      APP_URL: `${JSON.stringify(APP_URL)}`,
      API_URL: `${JSON.stringify(API_URL)}`,
      LOCAL_API_URL: JSON.stringify(localApiUrl ?? ""),
    },
    resolve: { tsconfigPaths: true },
    plugins: [
      // ビルド時の SPA プリレンダーは HTTP で内部サーバーに接続するため、
      // 自己署名証明書は開発サーバーだけで使う
      ...(command === "serve" && !isPreview
        ? [
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
          ]
        : []),
      reactRouter(),
      tailwindcss(),
    ],
  };
});

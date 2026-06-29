import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import { getPlatformProxy } from "wrangler";

export default defineConfig(async () => {
  const proxy = await getPlatformProxy({
    environment: process.env.CF_ENV || "develop",
  });
  const { APP_URL, API_URL } = proxy.env;

  if (typeof APP_URL !== "string" || typeof API_URL !== "string") {
    throw new Error("APP_URL or API_URL must be defined");
  }

  const server = {
    host: true,
    port: 3000,
    hmr: {
      host: "local.kotohiro.com",
      protocol: "wss",
      clientPort: 3000,
    },
    proxy: {},
  };

  return {
    server: process.env.CF_ENV ? undefined : server,
    define: {
      APP_URL: `${JSON.stringify(APP_URL)}`,
      API_URL: `${JSON.stringify(API_URL)}`,
    },
    resolve: { tsconfigPaths: true },
    plugins: [
      basicSsl({
        name: "kotohiro",
        domains: ["local.kotohiro.com"],
        // pnpm install で消えないよう node_modules 外に固定し、
        // 一度ホストのキーチェインに信頼登録すれば再登録不要にする
        certDir: ".cert",
        // ブラウザのTLS有効期限上限(398日)未満。再登録頻度を下げる
        ttlDays: 397,
      }),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      reactRouter(),
      tailwindcss(),
    ],
  };
});

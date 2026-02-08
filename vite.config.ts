// biome-ignore lint/correctness/noNodejsModules: <explanation>
import fs from "node:fs";
// biome-ignore lint/correctness/noNodejsModules: <explanation>
import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getPlatformProxy } from "wrangler";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Storybookの時はStorybook用の設定を返す
  if (process.env.SB) {
    return {
      plugins: [tsconfigPaths(), tailwindcss()],
    };
  }

  if (!env.CF_ENV) {
    throw new Error("CF_ENV must be defined");
  }

  const proxy = await getPlatformProxy({
    environment: process.env.CF_ENV,
  });
  const { APP_URL, API_URL } = proxy.env;

  if (typeof APP_URL !== "string" || typeof API_URL !== "string") {
    throw new Error("APP_URL or API_URL must be defined");
  }

  const httpsConfig = {
    key: fs.readFileSync(
      path.resolve(__dirname, "certifications/local.kotohiro.com.key"),
    ),
    cert: fs.readFileSync(
      path.resolve(__dirname, "certifications/local.kotohiro.com.crt"),
    ),
  };

  return {
    server: {
      https: httpsConfig,
      host: true,
      port: 3000,
      hmr: {
        host: "local.kotohiro.com",
        protocol: "wss",
        clientPort: 3000,
      },
      proxy: {},
    },
    define: {
      APP_URL: `${JSON.stringify(APP_URL)}`,
      API_URL: `${JSON.stringify(API_URL)}`,
    },
    plugins: [
      cloudflareDevProxy({
        getLoadContext: ({ context }) => ({ cloudflare: context.cloudflare }),
      }),
      reactRouter(),
      tsconfigPaths(),
      tailwindcss(),
    ],
  };
});

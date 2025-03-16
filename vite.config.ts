import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import { getPlatformProxy } from "wrangler";

export default defineConfig(async () => {
  // Storybookの時はStorybook用の設定を返す
  if (process.env.SB) {
    return {
      plugins: [tsconfigPaths(), tailwindcss()],
    };
  }

  const proxy = await getPlatformProxy();
  const { APP_URL, API_URL } = proxy.env;

  if (typeof APP_URL !== "string" || typeof API_URL !== "string") {
    throw new Error("APP_URL or API_URL must be defined");
  }

  const httpsConfig = {
    key: fs.readFileSync(path.resolve(__dirname, "certificates/server.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "certificates/server.crt")),
  };

  return {
    server: {
      https: httpsConfig,
      host: "local.kotohiro.com",
      port: 3000,
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

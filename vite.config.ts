// biome-ignore lint/correctness/noNodejsModules: <explanation>
import fs from "node:fs";
// biome-ignore lint/correctness/noNodejsModules: <explanation>
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
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
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "certifications/local.kotohiro.com.key"),
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "certifications/local.kotohiro.com.crt"),
      ),
    },
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
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      reactRouter(),
      tailwindcss(),
    ],
  };
});

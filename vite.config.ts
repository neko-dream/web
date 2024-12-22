import { reactRouter } from "@react-router/dev/vite";
import "dotenv/config";
import { defineConfig, loadEnv, UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode || "", process.cwd()) };

  if (!process.env.API_BASE_URL || !process.env.BASE_URL) {
    throw new Error("❌ 必要な環境変数が読み込めていません。");
  }

  return defineConfig({
    define: {
      BASE_URL: `${JSON.stringify(process.env.BASE_URL)}`,
      API_BASE_URL: `${JSON.stringify(process.env.API_BASE_URL)}`,
      FUNCTIONS_URL: `${JSON.stringify(process.env.FUNCTIONS_URL)}`,
    },
    server: {
      proxy: {},
      host: "local.kotohiro.com",
      port: 3000,
      https: {
        key: fs.readFileSync("./certificates/server.key"),
        cert: fs.readFileSync("./certificates/server.crt"),
      },
    },
    plugins: [cloudflareDevProxy(), reactRouter(), tsconfigPaths()],
  });
};

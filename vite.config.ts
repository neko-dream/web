import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig(() => ({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certificates/server.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "certificates/server.crt")),
    },
    host: "local.kotohiro.com",
    port: 3000,
    proxy: {},
  },
  define: {
    BASE_URL: `${JSON.stringify("https://www.kotohiro.com")}`,
    API_BASE_URL: `${JSON.stringify("https://api.kotohiro.com")}`,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    cloudflareDevProxy({
      getLoadContext({ context }) {
        return { cloudflare: context.cloudflare };
      },
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
}));

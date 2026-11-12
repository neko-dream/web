import type { Config } from "@react-router/dev/config";

export default {
  // 画面はブラウザで描画する。ビルド時に SPA 用の index.html を生成する。
  ssr: false,
} satisfies Config;

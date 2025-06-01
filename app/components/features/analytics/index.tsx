import { useEffect } from "react";
import { api } from "~/libs/openapi-fetch";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>,
    ) => void;
  }
}

const ID = "G-G9K1SZJ553"; // Google AnalyticsのID

export const Analytics = () => {
  useEffect(() => {
    // ユーザーがログイン済みの場合のみGoogle Analyticsを初期化
    api
      .GET("/user", { credentials: "include" })
      .then(({ data }) => {
        if (!data?.user) {
          return;
        }

        // Google Analytics を初期化
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || ((...args) => window.dataLayer.push(args));
        window.gtag("js", new Date());
        window.gtag("config", ID);

        // すでにあれば処理ウァ行わない
        if (document.querySelector('script[src*="googletagmanager"]')) {
          return;
        }
        // Google Analytics スクリプトを動的に追加
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
        document.head.appendChild(script);
      })
      .catch(() => {
        // GA4の初期化に失敗した場合はなんもできん...
      });
  }, []);

  return null;
};

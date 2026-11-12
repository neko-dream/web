import { useEffect, useState } from "react";

const buildUrls = (origin: string) => ({
  google: `${API_URL}/auth/google/login?redirect_url=${origin}/auth/signup`,
  line: `${API_URL}/auth/line/login?redirect_url=${origin}/auth/signup`,
});

/**
 * OAuth ログイン URL を返す。
 * redirect_url はビルド時の APP_URL ではなく現在のオリジンを使い、
 * workers.dev のプレビュー環境などでもログイン後に元のドメインへ戻れるようにする。
 * （SSR 時は window がないため APP_URL で描画し、マウント後に差し替える）
 */
export const useLoginUrls = () => {
  const [urls, setUrls] = useState(() => buildUrls(APP_URL));

  useEffect(() => {
    setUrls(buildUrls(window.location.origin));
  }, []);

  return urls;
};

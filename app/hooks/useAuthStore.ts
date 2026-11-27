import { create } from "zustand";
import { api } from "~/libs/openapi-fetch";
import type { components } from "~/types/openapi";

type TokenClaim = components["schemas"]["TokenClaim"];
type UserPermissions = components["schemas"]["UserPermissions"];

type AuthStore = {
  /** 初回の認証取得が終わるまでは loading。ヘッダーのスケルトン表示に使う */
  status: "loading" | "ready";
  user: TokenClaim | null;
  permissions: UserPermissions | null;
  refresh: () => Promise<void>;
};

// 初回ロードとログインが競合したとき、古い（未ログイン時の）レスポンスで
// 新しい認証状態を上書きしないようにする
let latestRefreshID = 0;

/**
 * 認証状態の唯一の保持先。
 *
 * SPA ではレイアウトの clientLoader がクライアント遷移で再実行されないため、
 * ログイン成功時に refresh() を呼んで全画面へ反映する。
 */
export const useAuthStore = create<AuthStore>((set) => ({
  status: "loading",
  user: null,
  permissions: null,
  refresh: async () => {
    const refreshID = ++latestRefreshID;
    const [tokenResult, meResult] = await Promise.allSettled([
      api.GET("/auth/token/info"),
      api.GET("/users/me"),
    ]);

    if (refreshID !== latestRefreshID) {
      return;
    }

    // HTTPエラーはdataがundefinedになるだけなので、ここでログが出るのは
    // ネットワーク断などリクエスト自体が失敗した場合だけ
    if (tokenResult.status === "rejected") {
      console.error("ユーザー情報の取得に失敗しました", tokenResult.reason);
    }
    if (meResult.status === "rejected") {
      console.error("セッション作成権限の取得に失敗しました", meResult.reason);
    }

    set({
      user:
        tokenResult.status === "fulfilled"
          ? (tokenResult.value.data ?? null)
          : null,
      permissions:
        meResult.status === "fulfilled"
          ? (meResult.value.data?.permissions ?? null)
          : null,
      status: "ready",
    });
  },
}));

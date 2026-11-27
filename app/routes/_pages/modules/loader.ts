import { useAuthStore } from "~/hooks/useAuthStore";

export const clientLoader = () => {
  // 初回ロード時の認証取得。完了を待つとページ全体の表示が遅れるため、
  // ストアの status でヘッダーだけスケルトンを出す
  void useAuthStore.getState().refresh();
  return null;
};

/**
 * ログイン・本人確認画面のレスポンスヘッダー
 * 確認トークンを含むURLをキャッシュ・Referer経由で残さない
 */
export const authHeaders = () => ({
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
});

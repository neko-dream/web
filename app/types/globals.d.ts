/**
 * 環境変数を追加するときは vite.config.ts で確認してから使用してください。
 */

/** */
declare const API_URL: string;
declare const APP_URL: string;
/** ローカルAPI接続時のみ設定される（`pnpm dev:local`）。それ以外は空文字 */
declare const LOCAL_API_URL: string;

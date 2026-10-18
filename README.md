## ことひろのフロント実装

ローカル API との接続は [ローカル開発](docs/local-development.md) を参照。

[☁️ Cloudflare](https://dash.cloudflare.com)

[📈 Google Analytics](https://analytics.google.com/analytics/web)

[💬 Discord](https://discord.com/channels/1365303564477530113/1365303564477530117)

[🤖 Swagger](https://api.dev.kotohiro.com/docs/)

## セッション作成権限

`GET /users/me` の `permissions.canCreateTalkSession` で作成ボタンと `/make/new` へのアクセスを制御する。組織ログインや token/info の組織情報とは独立している。既存セッションの編集認可は変更しない。

対応APIを先にデプロイする。API未提供・障害時は作成を許可しない。管理画面での許可・解除は次の遷移または再読み込みで表示に反映され、APIは作成POSTでも現在の許可を確認する。ユーザー間で権限を共有キャッシュしない。

## 検証・型生成

- `pnpm test`: 権限判定と実loaderのCookie転送・通信障害・編集導線を検証する。Node 24を使用し、テスト専用の標準モジュールフックで既存の `~/` aliasを解決する。
- `pnpm typecheck`: アプリとテストを型チェックする。Workerの型生成も含む。
- `CLOUDFLARE_ENV=develop pnpm build`: develop向けクライアント／SSRビルド。
- API契約変更は `tools/kotohiro.openapi.yaml` へ反映して `pnpm generate:api` を実行する。`app/types/openapi.ts` を手編集しない。CIでも再生成結果に差分がないことを確認する。

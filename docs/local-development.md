# ローカル API との接続

Node 24+ と pnpm を使用する。API リポジトリで
`bash scripts/dev-local.sh` を起動してから、このリポジトリで:

```sh
pnpm install --frozen-lockfile
pnpm dev:local
```

`https://localhost:3000` を開く。初回は自己署名証明書の警告を確認して続行する。
証明書は `.cert/localhost` に保存する。hosts 設定は不要。

ブラウザからの API リクエストは `https://localhost:3000/api` 経由で
`http://127.0.0.1:8080` に中継する。SSR は同じ API に直接接続して
受信 Cookie を転送する。ローカル API は `ENV=local` で起動して
Domain 指定なしの Secure / HttpOnly Cookie を発行する。

`pnpm dev` の通常設定は変更しない。`dev:local` と `CLOUDFLARE_ENV` の併用は
接続先の混同を防ぐため拒否する。ポート 3000 を固定しているので競合時は
既存プロセスを確認する。

API のポートを変更する場合は、API 起動設定と揃えて:

```sh
LOCAL_API_URL=http://127.0.0.1:8081 pnpm dev
```

Google / LINE ではプロバイダーへのローカル callback URL 登録が別途必要。
接続確認にはトップ画面のゲストログインか `/api/auth/dev/login` を使用できる。

ローカル起動には Cloudflare ログインは不要。`wrangler.local.toml` を使用して
リモート binding を無効にする。Flagship 未接続時はアンケートの feature flag
の既定値（false）を使用する。

/**
 * メールログインのAPI呼び出し
 *
 * verify / verify-pin はOpenAPI未定義のため fetch を直接使う。
 * Nodeのテストランナーから読み込むので、パスエイリアス（~/）は使わない。
 */

export class EmailLoginError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * 画面に表示するエラーメッセージに変換する
 */
export function toErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "通信に失敗しました。もう一度お試しください。";
}

async function readResponse(
  response: Response,
): Promise<Record<string, unknown>> {
  const data: unknown = await response.json().catch(() => null);
  const body =
    typeof data === "object" && data !== null
      ? (data as Record<string, unknown>)
      : {};
  if (!response.ok) {
    throw new EmailLoginError(
      typeof body.message === "string"
        ? body.message
        : "手続きを完了できませんでした。もう一度お試しください。",
      response.status,
    );
  }
  return body;
}

/**
 * パスワードを確認し、本人確認メールを送信する
 * @returns 確認リンク・確認コードの有効期限
 */
export async function beginEmailLogin(
  email: string,
  password: string,
): Promise<string> {
  const form = new FormData();
  form.set("idOrEmail", email);
  form.set("password", password);
  const response = await fetch(`${API_URL}/auth/password/login`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = await readResponse(response);
  if (
    response.status !== 202 ||
    data.verificationRequired !== true ||
    typeof data.expiresAt !== "string" ||
    Number.isNaN(Date.parse(data.expiresAt))
  ) {
    throw new Error(
      "メール確認を開始できませんでした。もう一度ログインしてください。",
    );
  }
  return data.expiresAt;
}

/**
 * メールの確認リンクで本人確認する
 * @returns ログイン後の移動先
 */
export function confirmEmailLogin(token: string): Promise<string> {
  return confirmEmailChallenge("verify", { token });
}

/**
 * メールの6桁の確認コードで本人確認する
 * @returns ログイン後の移動先
 */
export function confirmEmailPIN(pin: string): Promise<string> {
  return confirmEmailChallenge("verify-pin", { pin });
}

async function confirmEmailChallenge(
  route: "verify" | "verify-pin",
  payload: { token: string } | { pin: string },
): Promise<string> {
  const response = await fetch(`${API_URL}/auth/password/${route}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await readResponse(response);
  if (typeof data.redirectURL !== "string" || !URL.canParse(data.redirectURL)) {
    throw new Error("ログイン後の移動先を確認できませんでした。");
  }
  const destination = new URL(data.redirectURL);
  if (
    destination.protocol !== "https:" ||
    destination.origin !== new URL(APP_URL).origin
  ) {
    throw new Error("ログイン後の移動先が不正です。");
  }
  return destination.href;
}

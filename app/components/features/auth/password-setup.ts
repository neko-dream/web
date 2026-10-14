import { readResponse } from "~/components/features/auth/email-login";

const SETUP_TOKEN_PATTERN = /^[A-Za-z0-9+/]{42}[AEIMQUYcgkosw048]=$/;

export interface PasswordPolicy {
  minLength: number;
  maxBytes: number;
}

export async function loadPasswordPolicy(
  signal?: AbortSignal,
): Promise<PasswordPolicy> {
  const response = await fetch(`${API_URL}/auth/password/policy`, {
    credentials: "omit",
    cache: "no-store",
    signal,
  });
  const data = await readResponse(response);
  if (
    response.status !== 200 ||
    typeof data.minLength !== "number" ||
    !Number.isSafeInteger(data.minLength) ||
    data.minLength < 1 ||
    typeof data.maxBytes !== "number" ||
    !Number.isSafeInteger(data.maxBytes) ||
    data.maxBytes < data.minLength
  ) {
    throw new Error(
      "パスワードの入力条件を取得できませんでした。画面を開き直してください。",
    );
  }
  return { minLength: data.minLength, maxBytes: data.maxBytes };
}

export function isPasswordSetupToken(token: string): boolean {
  return token.length === 44 && SETUP_TOKEN_PATTERN.test(token);
}

export function validateSetupPassword(
  password: string,
  confirmation: string,
  policy: PasswordPolicy,
): string {
  if (Array.from(password).length < policy.minLength) {
    return `パスワードは${policy.minLength}文字以上で入力してください。`;
  }
  if (new TextEncoder().encode(password).length > policy.maxBytes) {
    return "パスワードが長すぎます。短いものにしてください。";
  }
  if (password !== confirmation) {
    return "確認用のパスワードが一致していません。";
  }
  return "";
}

export async function setupPassword(
  token: string,
  password: string,
): Promise<void> {
  if (!isPasswordSetupToken(token)) {
    throw new Error("メールに届いた設定リンクから開いてください。");
  }
  const response = await fetch(`${API_URL}/auth/password/setup`, {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  await readResponse(response);
  if (response.status !== 204) {
    throw new Error("パスワード設定の結果を確認できませんでした。");
  }
}

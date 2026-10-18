import { readResponse } from "~/components/features/auth/email-login";

const SETUP_TOKEN_PATTERN = /^[A-Za-z0-9+/]{42}[AEIMQUYcgkosw048]=$/;
// サーバー（Go の unicode.IsControl / unicode.IsSpace）と同じ文字集合で判定する。
const CONTROL_CHARACTER_PATTERN = /\p{Cc}/u;
const SURROUNDING_WHITESPACE_PATTERN = /^\p{White_Space}|\p{White_Space}$/u;

export interface PasswordPolicy {
  minLength: number;
  maxBytes: number;
  forbidControlCharacters: boolean;
  forbidSurroundingWhitespace: boolean;
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
    data.maxBytes < data.minLength ||
    typeof data.forbidControlCharacters !== "boolean" ||
    typeof data.forbidSurroundingWhitespace !== "boolean"
  ) {
    throw new Error(
      "パスワードの入力条件を取得できませんでした。画面を開き直してください。",
    );
  }
  return {
    minLength: data.minLength,
    maxBytes: data.maxBytes,
    forbidControlCharacters: data.forbidControlCharacters,
    forbidSurroundingWhitespace: data.forbidSurroundingWhitespace,
  };
}

// 入力欄の案内文。改行・タブは通常の入力欄では入力できないため、空白のルールだけを案内する。
export function describePasswordPolicy(policy: PasswordPolicy): string {
  const length = `${policy.minLength}文字以上（英数字は最大${policy.maxBytes}文字）`;
  return policy.forbidSurroundingWhitespace
    ? `${length}。先頭と末尾に空白は使えません`
    : length;
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
  if (
    policy.forbidControlCharacters &&
    CONTROL_CHARACTER_PATTERN.test(password)
  ) {
    return "改行やタブなどの特殊な文字は使えません。";
  }
  if (
    policy.forbidSurroundingWhitespace &&
    SURROUNDING_WHITESPACE_PATTERN.test(password)
  ) {
    return "パスワードの先頭と末尾に空白は使えません。";
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

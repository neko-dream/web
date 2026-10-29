// biome-ignore lint/correctness/noNodejsModules: Test-only Node import.
import assert from "node:assert/strict";
// biome-ignore lint/correctness/noNodejsModules: Test-only Node import.
import { afterEach, beforeEach, test } from "node:test";
import { EmailLoginError } from "../app/components/features/auth/email-login.ts";
import {
  describePasswordPolicy,
  isPasswordSetupToken,
  loadPasswordPolicy,
  setupPassword,
  validateSetupPassword,
} from "../app/components/features/auth/password-setup.ts";

const token = `${"A".repeat(43)}=`;
const previousFetch = globalThis.fetch;
const minimumMessage = /12文字/;
const mismatchMessage = /一致/;
const maximumMessage = /長すぎ/;
const whitespaceMessage = /先頭と末尾に空白は使えません/;
const controlMessage = /改行やタブなどの特殊な文字は使えません/;
const policy = {
  minLength: 12,
  maxBytes: 55,
  forbidControlCharacters: true,
  forbidSurroundingWhitespace: true,
};
beforeEach(() => {
  (globalThis as typeof globalThis & { API_URL: string }).API_URL =
    "https://api.example.com";
});
afterEach(() => {
  globalThis.fetch = previousFetch;
});

test("initial password setup posts JSON without existing login cookies and never logs in", async () => {
  let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls++;
    assert.equal(input, "https://api.example.com/auth/password/setup");
    assert.equal(init?.method, "POST");
    assert.equal(init?.credentials, "omit");
    assert.deepEqual(init?.headers, { "Content-Type": "application/json" });
    assert.deepEqual(JSON.parse(String(init?.body)), {
      token,
      password: "new-password-value",
    });
    return new Response(null, { status: 204 });
  };
  await setupPassword(token, "new-password-value");
  assert.equal(calls, 1);
});

test("malformed setup links cause no API mutation", async () => {
  globalThis.fetch = async () => {
    throw new Error("must not fetch");
  };
  for (const invalid of [
    "",
    "short",
    "A".repeat(44),
    `${"A".repeat(42)}==`,
    `${"A".repeat(42)}B=`,
    `${"A".repeat(42)}\n=`,
    `${token}\n`,
    `${token}\r\n`,
    "<script>",
  ]) {
    assert.equal(isPasswordSetupToken(invalid), false);
    await assert.rejects(setupPassword(invalid, "new-password-value"), {
      message: "メールに届いた設定リンクから開いてください。",
    });
  }
});

test("expired or consumed links show the actionable API error; unexpected success is not accepted", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ message: "管理者に再送を依頼してください。" }),
      { status: 400 },
    );
  await assert.rejects(
    setupPassword(token, "new-password-value"),
    (error) =>
      error instanceof EmailLoginError &&
      error.status === 400 &&
      error.message === "管理者に再送を依頼してください。",
  );
  globalThis.fetch = async () => new Response("{}", { status: 200 });
  await assert.rejects(setupPassword(token, "new-password-value"));
});

test("password confirmation uses server-supplied Unicode minimum and UTF-8 byte maximum without trimming", () => {
  assert.match(validateSetupPassword("short", "short", policy), minimumMessage);
  assert.match(
    validateSetupPassword("valid-password", "different-value", policy),
    mismatchMessage,
  );
  assert.match(
    validateSetupPassword("あ".repeat(25), "あ".repeat(25), policy),
    maximumMessage,
  );
  assert.equal(
    validateSetupPassword("あ".repeat(12), "あ".repeat(12), policy),
    "",
  );
  assert.match(
    validateSetupPassword(` ${"a".repeat(12)}`, ` ${"a".repeat(12)}`, policy),
    whitespaceMessage,
  );
});

test("control characters and surrounding whitespace follow the server policy flags", () => {
  for (const invalid of [
    "abcdef\nghijkl",
    "abcdef\r\nghijkl",
    "abcdef\tghijkl",
    "abcdef\u0000ghijkl",
    "abcdef\u007fghijkl",
    "abcdef\u0085ghijkl",
    `${"a".repeat(12)}\n`,
  ]) {
    assert.match(
      validateSetupPassword(invalid, invalid, policy),
      controlMessage,
    );
  }
  for (const invalid of [
    `${"a".repeat(12)} `,
    ` ${"a".repeat(12)}`,
    `\u3000${"a".repeat(12)}`,
    `${"あ".repeat(12)}\u3000`,
  ]) {
    assert.match(
      validateSetupPassword(invalid, invalid, policy),
      whitespaceMessage,
    );
  }
  for (const valid of [
    "abcdef ghijkl",
    "あいうえお\u3000かきくけこさ",
    "パスワードは日本語でもいい",
  ]) {
    assert.equal(validateSetupPassword(valid, valid, policy), "");
  }
  const permissive = {
    ...policy,
    forbidControlCharacters: false,
    forbidSurroundingWhitespace: false,
  };
  assert.equal(
    validateSetupPassword(
      ` ${"a".repeat(11)}\n`,
      ` ${"a".repeat(11)}\n`,
      permissive,
    ),
    "",
  );
});

test("password policy is retrieved without authentication cookies or cache", async () => {
  const abort = new AbortController();
  globalThis.fetch = async (input, init) => {
    assert.equal(input, "https://api.example.com/auth/password/policy");
    assert.equal(init?.credentials, "omit");
    assert.equal(init?.cache, "no-store");
    assert.equal(init?.signal, abort.signal);
    return new Response(JSON.stringify(policy), { status: 200 });
  };
  assert.deepEqual(await loadPasswordPolicy(abort.signal), policy);
});

test("missing or malformed policy never silently falls back to hardcoded limits", async () => {
  for (const body of [
    null,
    {},
    [],
    { ...policy, minLength: 0 },
    { ...policy, maxBytes: 11 },
    { ...policy, minLength: "12" },
    { ...policy, minLength: 12.5 },
    { ...policy, maxBytes: -1 },
    { ...policy, maxBytes: 55.5 },
    { minLength: 12, maxBytes: 55 },
    { ...policy, forbidControlCharacters: "true" },
    { ...policy, forbidSurroundingWhitespace: 1 },
  ]) {
    globalThis.fetch = async () =>
      new Response(JSON.stringify(body), { status: 200 });
    await assert.rejects(loadPasswordPolicy());
  }
  globalThis.fetch = async () =>
    new Response(JSON.stringify(policy), { status: 500 });
  await assert.rejects(loadPasswordPolicy());
  globalThis.fetch = async () => {
    throw new Error("offline");
  };
  await assert.rejects(loadPasswordPolicy());
});

test("server policy boundaries count code points, not UTF-16 units, and never trim passwords", () => {
  for (const maxBytes of [12, 36, 55, 66, 72]) {
    const policy = {
      minLength: 12,
      maxBytes,
      forbidControlCharacters: true,
      forbidSurroundingWhitespace: true,
    };
    assert.equal(
      validateSetupPassword("a".repeat(maxBytes), "a".repeat(maxBytes), policy),
      "",
    );
    assert.match(
      validateSetupPassword(
        "a".repeat(maxBytes + 1),
        "a".repeat(maxBytes + 1),
        policy,
      ),
      maximumMessage,
    );
    assert.match(
      validateSetupPassword("😀".repeat(11), "😀".repeat(11), policy),
      minimumMessage,
    );
    assert.equal(
      validateSetupPassword(
        `a ${"a".repeat(10)}`,
        `a ${"a".repeat(10)}`,
        policy,
      ),
      "",
    );
  }
  assert.equal(
    validateSetupPassword("😀".repeat(12), "😀".repeat(12), policy),
    "",
  );
  assert.match(
    validateSetupPassword("😀".repeat(14), "😀".repeat(14), policy),
    maximumMessage,
  );
  // Constraints are data, including the minimum, rather than a second fixed policy.
  assert.equal(
    validateSetupPassword("short", "short", {
      ...policy,
      minLength: 5,
      maxBytes: 8,
    }),
    "",
  );
});

test("policy caption tells the server-supplied rules before submission", () => {
  assert.equal(
    describePasswordPolicy(policy),
    "12文字以上（英数字は最大55文字）。先頭と末尾に空白は使えません",
  );
  assert.equal(
    describePasswordPolicy({ ...policy, forbidSurroundingWhitespace: false }),
    "12文字以上（英数字は最大55文字）",
  );
});

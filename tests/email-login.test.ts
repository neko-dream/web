// biome-ignore lint/correctness/noNodejsModules: This file runs only in the Node test runner.
import assert from "node:assert/strict";
// biome-ignore lint/correctness/noNodejsModules: This file runs only in the Node test runner.
import { afterEach, beforeEach, test } from "node:test";
import {
  EmailLoginError,
  beginEmailLogin,
  confirmEmailLogin,
  confirmEmailPIN,
} from "../app/components/features/auth/email-login.ts";

const originalFetch = globalThis.fetch;
const globals = globalThis as typeof globalThis & {
  API_URL: string;
  APP_URL: string;
};
test("PIN preserves leading zeros and sends only JSON with browser credentials", async () => {
  globalThis.fetch = (input, init) => {
    assert.equal(input, "https://api.example.com/auth/password/verify-pin");
    assert.equal(init?.credentials, "include");
    assert.equal(init?.method, "POST");
    assert.equal(init?.body, JSON.stringify({ pin: "000001" }));
    return Promise.resolve(
      response({ redirectURL: "https://app.example.com/home" }),
    );
  };
  assert.equal(await confirmEmailPIN("000001"), "https://app.example.com/home");
});
test("PIN lockout remains a typed API error", async () => {
  globalThis.fetch = async () =>
    response({ message: "確認メールを再送してください" }, 429);
  await assert.rejects(
    confirmEmailPIN("000001"),
    (error) => error instanceof EmailLoginError && error.status === 429,
  );
});
beforeEach(() => {
  globals.API_URL = "https://api.example.com";
  globals.APP_URL = "https://app.example.com";
});
afterEach(() => {
  globalThis.fetch = originalFetch;
});
function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
test("password starts verification but never calls confirmation", async () => {
  let calls = 0;
  globalThis.fetch = (input, init) => {
    calls++;
    assert.equal(input, "https://api.example.com/auth/password/login");
    assert.equal(init?.credentials, "include");
    assert.equal(init?.method, "POST");
    assert.ok(init?.body instanceof FormData);
    assert.equal(init.body.get("idOrEmail"), "city@example.com");
    assert.equal(init.body.get("password"), "password");
    return Promise.resolve(
      response(
        { verificationRequired: true, expiresAt: "2026-10-08T00:15:00Z" },
        202,
      ),
    );
  };
  assert.equal(
    await beginEmailLogin("city@example.com", "password"),
    "2026-10-08T00:15:00Z",
  );
  assert.equal(calls, 1);
});
test("unexpected successful login responses are not treated as verification", async () => {
  for (const [body, status] of [
    [{}, 200],
    [{ verificationRequired: false, expiresAt: "2026-10-08T00:15:00Z" }, 202],
    [{ verificationRequired: true, expiresAt: "invalid" }, 202],
  ] as const) {
    globalThis.fetch = async () => response(body, status);
    await assert.rejects(beginEmailLogin("city@example.com", "password"));
  }
});
test("resend cooldown remains a typed API error", async () => {
  globalThis.fetch = async () =>
    response({ message: "60秒待ってください" }, 429);
  await assert.rejects(
    beginEmailLogin("city@example.com", "password"),
    (error) =>
      error instanceof EmailLoginError &&
      error.status === 429 &&
      error.message === "60秒待ってください",
  );
});
test("confirmation sends a JSON token with browser credentials", async () => {
  globalThis.fetch = (input, init) => {
    assert.equal(input, "https://api.example.com/auth/password/verify");
    assert.equal(init?.credentials, "include");
    assert.equal(init?.body, JSON.stringify({ token: "one-time-token" }));
    assert.deepEqual(init?.headers, { "Content-Type": "application/json" });
    return Promise.resolve(
      response({ redirectURL: "https://app.example.com/home" }),
    );
  };
  assert.equal(
    await confirmEmailLogin("one-time-token"),
    "https://app.example.com/home",
  );
});
test("confirmation refuses redirects to another origin or non-HTTPS schemes", async () => {
  for (const redirectURL of [
    "https://evil.example/home",
    "http://app.example.com/home",
    "javascript:alert(1)",
  ]) {
    globalThis.fetch = async () => response({ redirectURL });
    await assert.rejects(confirmEmailLogin("one-time-token"));
  }
});
test("relative redirects fail with a Japanese message instead of a URL parse error", async () => {
  globalThis.fetch = async () => response({ redirectURL: "/home" });
  await assert.rejects(confirmEmailLogin("one-time-token"), {
    message: "ログイン後の移動先を確認できませんでした。",
  });
});
test("expired or reused links return an actionable API error", async () => {
  globalThis.fetch = async () =>
    response({ message: "ログインからやり直してください" }, 400);
  await assert.rejects(
    confirmEmailLogin("one-time-token"),
    (error) => error instanceof EmailLoginError && error.status === 400,
  );
});

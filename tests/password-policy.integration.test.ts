// biome-ignore lint/correctness/noNodejsModules: Test-only Node import.
import assert from "node:assert/strict";
// biome-ignore lint/correctness/noNodejsModules: Test-only Node import.
import { test } from "node:test";
import {
  loadPasswordPolicy,
  validateSetupPassword,
} from "../app/components/features/auth/password-setup.ts";

const localAPI = process.env.PASSWORD_SETUP_TEST_API_URL;

test(
  "frontend password boundaries match the running local server without changing an account",
  { skip: !localAPI },
  async () => {
    // Do not run this opt-in integration test against dev or production.
    assert.equal(localAPI, "http://127.0.0.1:8082");
    (globalThis as typeof globalThis & { API_URL: string }).API_URL = localAPI;
    const policy = await loadPasswordPolicy();
    assert.equal(policy.minLength, 12);
    const cases: [string, string][] = [
      ["a".repeat(policy.minLength - 1), "PASSWORD-TOO-SHORT"],
      ["a".repeat(policy.minLength), "PASSWORD-SETUP-LINK"],
      ["a".repeat(policy.maxBytes), "PASSWORD-SETUP-LINK"],
      ["a".repeat(policy.maxBytes + 1), "PASSWORD-TOO-LONG"],
      ["あ".repeat(12), "PASSWORD-SETUP-LINK"],
      ["😀".repeat(11), "PASSWORD-TOO-SHORT"],
      ["😀".repeat(12), "PASSWORD-SETUP-LINK"],
      ["😀".repeat(Math.floor(policy.maxBytes / 4) + 1), "PASSWORD-TOO-LONG"],
      ["e\u0301".repeat(6), "PASSWORD-SETUP-LINK"],
      [` ${"a".repeat(11)}`, "PASSWORD-SETUP-LINK"],
    ];
    for (const [password, code] of cases) {
      // This all-zero synthetic secret is not a real invitation; valid passwords
      // reach the invalid-link error, while invalid passwords fail the policy.
      const response: Response = await fetch(
        `${localAPI}/auth/password/setup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://localhost:3002",
          },
          body: JSON.stringify({ token: `${"A".repeat(43)}=`, password }),
        },
      );
      const body = await response.json();
      assert.ok(
        typeof body === "object" &&
          body !== null &&
          "code" in body &&
          "message" in body,
      );
      assert.equal(response.status, 400);
      assert.equal(response.headers.get("set-cookie"), null);
      assert.equal(body.code, code);
      const frontendError = validateSetupPassword(password, password, policy);
      if (code === "PASSWORD-SETUP-LINK") {
        assert.equal(frontendError, "");
      } else {
        assert.equal(frontendError, body.message);
      }
    }
  },
);

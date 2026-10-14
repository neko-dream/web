// biome-ignore lint/correctness/noNodejsModules: Test-only assertions.
import assert from "node:assert/strict";
// biome-ignore lint/correctness/noNodejsModules: Test-only lifecycle and runner.
import { afterEach, test } from "node:test";

const globals = globalThis as typeof globalThis & {
  API_URL: string;
};
globals.API_URL = "https://api.example.com";
const { loader } = await import(
  "../app/routes/_pages.users.me/modules/loader.ts"
);
const originalFetch = globalThis.fetch;
const args = {
  request: new Request("https://app.example.com/users/me", {
    headers: { Cookie: "SessionId=local-test-cookie" },
  }),
  params: {},
  context: {},
} as Parameters<typeof loader>[0];

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const respond = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

test("profile loader uses the existing /user API and forwards authentication", async () => {
  const user = { displayID: "local-test", displayName: "ローカル確認" };
  globalThis.fetch = async (input) => {
    assert.ok(input instanceof Request);
    assert.equal(input.url, "https://api.example.com/user");
    assert.equal(input.headers.get("Cookie"), "SessionId=local-test-cookie");
    return respond({ user, demographics: {}, email: "city@example.com" }, 200);
  };
  assert.deepEqual(await loader(args), { user });
});

test("profile loader only treats authentication failures as forbidden", async () => {
  for (const status of [401, 403]) {
    globalThis.fetch = async () =>
      respond({ message: "ログインしてください" }, status);
    await assert.rejects(
      loader(args),
      (error) => error instanceof Response && error.status === 403,
    );
  }
});

test("profile loader preserves upstream failures instead of claiming the user is logged out", async () => {
  for (const status of [500, 502, 503]) {
    globalThis.fetch = async () =>
      respond({ message: "Internal Server Error" }, status);
    await assert.rejects(
      loader(args),
      (error) => error instanceof Response && error.status === status,
    );
  }
});

test("profile loader rejects malformed successful responses as server errors", async () => {
  globalThis.fetch = async () => respond({}, 200);
  await assert.rejects(
    loader(args),
    (error) => error instanceof Response && error.status === 500,
  );
});

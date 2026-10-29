// biome-ignore lint/correctness/noNodejsModules: Node's test runner is used only in tests.
import assert from "node:assert/strict";
// biome-ignore lint/correctness/noNodejsModules: Node's test runner is used only in tests.
import { test } from "node:test";
import { RouterContextProvider } from "react-router";

Object.assign(globalThis, { API_URL: "https://api.example.test" });
const { api } = await import("../app/libs/openapi-fetch/index.ts");
const { loader } = await import(
  "../app/routes/_pages.make.$session_id._index/modules/loader.ts"
);
const { loader: pagesLoader } = await import(
  "../app/routes/_pages/modules/loader.ts"
);

test("creation loader forwards cookies and denies ungranted, unauthenticated and missing users", async (t) => {
  for (const [status, allowed, expected] of [
    [200, true, 200],
    [200, false, 403],
    [403, false, 401],
    [404, false, 403],
    [500, false, 503],
  ] as const) {
    const fetchMock = t.mock.method(
      globalThis,
      "fetch",
      async (request: Request) => {
        assert.equal(request.url, "https://api.example.test/users/me");
        assert.equal(request.headers.get("cookie"), "SessionId=test-session");
        assert.equal(request.headers.has("host"), false);
        return new Response(
          JSON.stringify(
            status === 200
              ? {
                  userID: "self",
                  user: {},
                  permissions: { canCreateTalkSession: allowed },
                }
              : {},
          ),
          { status, headers: { "Content-Type": "application/json" } },
        );
      },
    );
    const args = {
      params: { session_id: "new" },
      request: new Request("https://web.example.test/make/new", {
        headers: { Cookie: "SessionId=test-session", Host: "web.example.test" },
      }),
      context: new RouterContextProvider(),
      url: new URL("https://web.example.test/make/new"),
      pattern: "/make/:session_id",
    };
    if (expected === 200) {
      assert.deepEqual(await loader(args), {});
    } else {
      await assert.rejects(
        loader(args),
        (error) => error instanceof Response && error.status === expected,
      );
    }
    assert.equal(fetchMock.mock.callCount(), 1);
    fetchMock.mock.restore();
  }
});

test("network failures deny creation with 503", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("network unavailable");
  });
  t.mock.method(console, "error", () => {});
  await assert.rejects(
    loader({
      params: { session_id: "new" },
      request: new Request("https://web.example.test/make/new"),
      context: new RouterContextProvider(),
      url: new URL("https://web.example.test/make/new"),
      pattern: "/make/:session_id",
    }),
    (error) => error instanceof Response && error.status === 503,
  );
});

test("editing an existing session does not depend on creation permission", async (t) => {
  const paths: string[] = [];
  t.mock.method(globalThis, "fetch", async (request: Request) => {
    paths.push(new URL(request.url).pathname);
    return new Response(
      JSON.stringify(request.url.endsWith("/survey") ? {} : { id: "existing" }),
      { headers: { "Content-Type": "application/json" } },
    );
  });
  const result = await loader({
    params: { session_id: "existing" },
    request: new Request("https://web.example.test/make/existing"),
    context: new RouterContextProvider(),
    url: new URL("https://web.example.test/make/existing"),
    pattern: "/make/:session_id",
  });
  assert.equal("isEditMode" in result && result.isEditMode, true);
  assert.deepEqual(paths.sort(), [
    "/talksessions/existing",
    "/talksessions/existing/survey",
  ]);
});

test("permissions fail closed with an observable error in the page loader", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("network unavailable");
  });
  const logger = t.mock.method(console, "error", () => {});
  const { $permissions } = pagesLoader({
    request: new Request("https://web.example.test/home"),
    params: {},
    context: new RouterContextProvider(),
    url: new URL("https://web.example.test/home"),
    pattern: "/home",
  });
  assert.equal(await $permissions, null);
  assert.ok(logger.mock.callCount() > 0);
});

test("the shared API client preserves explicit per-request credentials without forcing SSR", async (t) => {
  const requests: Array<{ request: Request; init?: RequestInit }> = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (request: Request, init?: RequestInit) => {
      requests.push({ request, init });
      return new Response(
        JSON.stringify({
          userID: "self",
          user: {},
          permissions: { canCreateTalkSession: false },
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    },
  );
  await api.GET("/users/me", { credentials: "include" });
  await api.GET("/users/me");
  assert.equal(requests[0].request.credentials, "include");
  assert.equal(requests[1].request.credentials, "same-origin");
  assert.equal(requests[0].init?.credentials, undefined);
  assert.equal(requests[1].init?.credentials, undefined);
});

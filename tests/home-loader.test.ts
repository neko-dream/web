import assert from "node:assert/strict";
import { test } from "node:test";
import {
  type ClientLoaderFunctionArgs,
  RouterContextProvider,
} from "react-router";

Object.assign(globalThis, { API_URL: "https://api.example.test" });
const { clientLoader } = await import(
  "../app/routes/_pages.home/modules/loader.ts"
);

const sessionsResponse = () =>
  new Response(
    JSON.stringify({
      talkSessions: [],
      pagination: { limit: 100, offset: 0, totalCount: 0 },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

const load = (path: string) => {
  const request = new Request(`https://web.example.test${path}`);
  return clientLoader({
    request,
    params: {},
    context: new RouterContextProvider(),
    url: new URL(request.url),
    pattern: "/home",
    serverLoader: async () => ({}),
  } as unknown as ClientLoaderFunctionArgs);
};

const statusOf = (url: URL) => url.searchParams.get("status");
const themeOf = (url: URL) => url.searchParams.get("theme");

test("home loader requests open and finished sessions separately", async (t) => {
  const urls: URL[] = [];
  t.mock.method(globalThis, "fetch", async (request: Request) => {
    urls.push(new URL(request.url));
    return sessionsResponse();
  });

  const data = load("/home");
  await Promise.all([data.$session, data.$closeSession]);

  assert.equal(urls.length, 2);
  assert.equal(statusOf(urls[0]), null);
  assert.equal(themeOf(urls[0]), null);
  assert.equal(urls[0].searchParams.get("limit"), "100");
  assert.equal(statusOf(urls[1]), "finished");
  assert.equal(data.theme, null);
});

test("home loader maps q=open to the open status without a theme", async (t) => {
  const urls: URL[] = [];
  t.mock.method(globalThis, "fetch", async (request: Request) => {
    urls.push(new URL(request.url));
    return sessionsResponse();
  });

  const data = load("/home?q=open");
  await Promise.all([data.$session, data.$closeSession]);

  assert.equal(statusOf(urls[0]), "open");
  assert.equal(themeOf(urls[0]), null);
  assert.equal(statusOf(urls[1]), "finished");
});

test("home loader sends any other q as the theme search", async (t) => {
  const urls: URL[] = [];
  t.mock.method(globalThis, "fetch", async (request: Request) => {
    urls.push(new URL(request.url));
    return sessionsResponse();
  });

  const data = load("/home?q=%E3%83%86%E3%82%B9%E3%83%88");
  await Promise.all([data.$session, data.$closeSession]);

  assert.equal(statusOf(urls[0]), null);
  assert.equal(themeOf(urls[0]), "テスト");
  assert.equal(data.theme, "テスト");
});

test("home loader falls back to empty results when the API is unreachable", async (t) => {
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("offline");
  });

  const data = load("/home");

  assert.equal(await data.$session, null);
  assert.equal(await data.$closeSession, null);
});

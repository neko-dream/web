// biome-ignore lint/correctness/noNodejsModules: Node-only build configuration tests.
import assert from "node:assert/strict";
// biome-ignore lint/correctness/noNodejsModules: Node-only build configuration tests.
import { readFileSync } from "node:fs";
// biome-ignore lint/correctness/noNodejsModules: Node-only build configuration tests.
import { test } from "node:test";
import { resolveUrls, selectEnvironment } from "../vite.env.ts";

const APP_URL_PATTERN = /^APP_URL = "([^"]+)"/m;
const API_URL_PATTERN = /^API_URL = "([^"]+)"/m;

test("every build needs an explicit known deployment environment", () => {
  for (const cloudflareEnv of [
    undefined,
    "",
    "prod",
    "local",
    "production-typo",
  ]) {
    assert.throws(() => selectEnvironment({ command: "build", cloudflareEnv }));
  }
  for (const cloudflareEnv of ["develop", "staging", "production"]) {
    assert.equal(
      selectEnvironment({ command: "build", cloudflareEnv }),
      cloudflareEnv,
    );
  }
});
test("local API configuration can never reach build output", () => {
  for (const cloudflareEnv of [undefined, "develop", "production"]) {
    assert.throws(() =>
      selectEnvironment({
        command: "build",
        cloudflareEnv,
        localApiUrl: "http://127.0.0.1:8080",
      }),
    );
  }
  assert.throws(() =>
    selectEnvironment({
      command: "serve",
      cloudflareEnv: "production",
      localApiUrl: "http://127.0.0.1:8080",
    }),
  );
  assert.throws(() =>
    selectEnvironment({
      command: "serve",
      localApiUrl: "http://remote.example:8080",
    }),
  );
  assert.equal(
    selectEnvironment({
      command: "serve",
      localApiUrl: "http://127.0.0.1:8080",
    }),
    undefined,
  );
  assert.deepEqual(resolveUrls(undefined), {
    APP_URL: "https://localhost:3000",
    API_URL: "https://localhost:3000/api",
  });
});
test("missing or unsafe deployment URLs never fall back to development", () => {
  for (const environment of ["develop", "staging", "production"]) {
    for (const env of [
      undefined,
      {},
      { APP_URL: "https://app.example.com" },
      { API_URL: "https://api.example.com" },
    ]) {
      assert.throws(() => resolveUrls(environment, env));
    }
    for (const value of [
      "http://example.com",
      "https://localhost",
      "https://localhost:3000",
      "https://127.0.0.1",
      "https://[::1]",
      "https://local.kotohiro.com",
      "https://mail.test",
      "https://app.example.com/path",
      "https://user:password@app.example.com",
    ]) {
      assert.throws(() =>
        resolveUrls(environment, {
          APP_URL: value,
          API_URL: "https://api.example.com",
        }),
      );
      assert.throws(() =>
        resolveUrls(environment, {
          APP_URL: "https://app.example.com",
          API_URL: value,
        }),
      );
    }
  }
});
test("production uses the canonical www origin and production API", () => {
  const config = readFileSync(
    new URL("../wrangler.toml", import.meta.url),
    "utf8",
  );
  const production = config.split("[env.production.vars]")[1]?.split("\n[")[0];
  assert.ok(production);
  const app = production.match(APP_URL_PATTERN)?.[1];
  const api = production.match(API_URL_PATTERN)?.[1];
  assert.deepEqual(resolveUrls("production", { APP_URL: app, API_URL: api }), {
    APP_URL: "https://www.kotohiro.com",
    API_URL: "https://api.kotohiro.com",
  });
});

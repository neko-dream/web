import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveUrls, selectEnvironment } from "../vite.env.ts";

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

test("Cloudflare preview builds resolve the environment from the branch", () => {
  for (const branch of ["docs/readme-cleanup", "feat/foo", undefined]) {
    assert.equal(
      selectEnvironment({
        command: "build",
        cloudflareEnv: "development",
        branch,
      }),
      "develop",
    );
  }
  assert.equal(
    selectEnvironment({
      command: "build",
      cloudflareEnv: "development",
      branch: "staging",
    }),
    "staging",
  );
  assert.equal(
    selectEnvironment({
      command: "build",
      cloudflareEnv: "development",
      branch: "main",
    }),
    "production",
  );
  assert.equal(
    selectEnvironment({ command: "build", branch: "staging" }),
    "staging",
  );
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

test("deployment URLs use per-environment defaults and reject unsafe overrides", () => {
  const defaults = {
    develop: {
      APP_URL: "https://develop.kotohiro.com",
      API_URL: "https://api.dev.kotohiro.com",
    },
    staging: {
      APP_URL: "https://staging.kotohiro.com",
      API_URL: "https://api.kotohiro.com",
    },
    production: {
      APP_URL: "https://www.kotohiro.com",
      API_URL: "https://api.kotohiro.com",
    },
  };

  for (const [environment, expected] of Object.entries(defaults)) {
    for (const env of [
      undefined,
      {},
      { APP_URL: expected.APP_URL },
      { API_URL: expected.API_URL },
    ]) {
      assert.deepEqual(resolveUrls(environment, env), expected);
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

  assert.deepEqual(
    resolveUrls("develop", {
      APP_URL: "https://app.example.com",
      API_URL: "https://api.example.com",
    }),
    {
      APP_URL: "https://app.example.com",
      API_URL: "https://api.example.com",
    },
  );
});

test("production uses the canonical www origin and production API", () => {
  assert.deepEqual(resolveUrls("production"), {
    APP_URL: "https://www.kotohiro.com",
    API_URL: "https://api.kotohiro.com",
  });
});

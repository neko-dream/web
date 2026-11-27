import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { ClientLoaderFunctionArgs } from "react-router";

Object.assign(globalThis, { API_URL: "https://api.example.test" });
const { clientLoader } = await import(
  "../app/routes/_pages.$session_id.reports/modules/loader.ts"
);
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const args = (query = ""): ClientLoaderFunctionArgs =>
  ({
    params: { session_id: "session-1" },
    request: new Request(`https://web.example.test/session-1/reports${query}`),
  }) as unknown as ClientLoaderFunctionArgs;

test("report tab query is limited to known values", async () => {
  globalThis.fetch = async (input) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.searchParams.get("status"), "unsolved");
    return new Response(JSON.stringify({ reports: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  };
  const result = await clientLoader(args("?q=unknown"));
  assert.equal(result.defaultTab, "unsolved");
});

test("report API failures are surfaced instead of shown as no reports", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ message: "server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

  await assert.rejects(
    clientLoader(args()),
    (error) => error instanceof Response && error.status === 500,
  );
});

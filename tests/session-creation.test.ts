// biome-ignore lint/correctness/noNodejsModules: Node's test runner is used only in tests.
import assert from "node:assert/strict";
// biome-ignore lint/correctness/noNodejsModules: Node's test runner is used only in tests.
import { test } from "node:test";
import {
  canCreateTalkSession,
  requireSessionCreationPermission,
} from "../app/libs/session-creation.ts";

test("creation visibility requires an explicit grant, not organization data", () => {
  assert.equal(canCreateTalkSession({ canCreateTalkSession: true }), true);
  assert.equal(canCreateTalkSession({ canCreateTalkSession: false }), false);
  assert.equal(canCreateTalkSession(null), false);
  assert.equal(canCreateTalkSession(undefined), false);
});

test("direct creation navigation fails closed on denial, missing data, or API failure", () => {
  requireSessionCreationPermission({
    data: { permissions: { canCreateTalkSession: true } },
    response: new Response(null, { status: 200 }),
  });
  for (const [status, expected] of [
    [200, 403],
    [401, 403],
    [403, 403],
    [404, 403],
    [500, 503],
    [503, 503],
  ]) {
    assert.throws(
      () =>
        requireSessionCreationPermission({
          data: { permissions: { canCreateTalkSession: false } },
          response: new Response(null, { status }),
        }),
      (error) => error instanceof Response && error.status === expected,
    );
  }
  assert.throws(
    () =>
      requireSessionCreationPermission({
        response: new Response(null, { status: 200 }),
      }),
    (error) => error instanceof Response && error.status === 403,
  );
  assert.throws(
    () =>
      requireSessionCreationPermission({
        data: { permissions: { canCreateTalkSession: true } },
        response: new Response(null, { status: 500 }),
      }),
    (error) => error instanceof Response && error.status === 503,
  );
});

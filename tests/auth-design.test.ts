import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const css = readFileSync(
  new URL("../app/components/features/auth/auth.css", import.meta.url),
  "utf8",
);
function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `missing rule ${selector}`);
  return match[1];
}
test("shared authentication dimensions preserve the Figma component tokens", () => {
  assert.match(rule(".auth-heading"), /font-size: 28px/);
  assert.match(rule(".auth-heading"), /line-height: 34px/);
  assert.match(rule(".auth-input"), /height: 48px/);
  assert.match(rule(".auth-input"), /font-size: 16px/);
  assert.match(rule(".auth-field-label"), /line-height: 1.55/);
  assert.match(rule(".auth-primary"), /min-height: 54px/);
  assert.match(rule(".auth-provider-link"), /min-height: 56px/);
  assert.match(rule(".auth-provider-link"), /font-size: 17px/);
  assert.match(rule(".auth-provider-link"), /border-radius: 16px/);
});
test("organization frame has no outer margins and keeps the Figma login pane fixed", () => {
  assert.match(rule(".organization-auth"), /width: 100%/);
  assert.match(rule(".organization-auth"), /margin: 0/);
  assert.match(rule(".organization-auth"), /1fr.*512px/);
  assert.match(rule(".organization-auth-form"), /max-width: 407px/);
  assert.match(rule(".organization-auth-form"), /padding: 40px 32px/);
});
test("Open Sans fonts and redistribution license are checked in for local delivery", () => {
  for (const path of [
    "open-sans-regular.ttf",
    "open-sans-bold.ttf",
    "OFL-open-sans.txt",
  ]) {
    assert.ok(
      statSync(new URL(`../public/fonts/${path}`, import.meta.url)).size > 0,
    );
  }
});

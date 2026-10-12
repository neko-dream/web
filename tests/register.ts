// biome-ignore lint/correctness/noNodejsModules: Test-only Node module resolution.
import { existsSync } from "node:fs";
// biome-ignore lint/correctness/noNodejsModules: Test-only Node module resolution.
import { registerHooks } from "node:module";
// biome-ignore lint/correctness/noNodejsModules: Test-only Node module resolution.
import { fileURLToPath } from "node:url";

// Resolve the application's existing ~/ alias without changing production imports.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("~/")) {
      const path = new URL(`../app/${specifier.slice(2)}`, import.meta.url);
      for (const suffix of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
        const url = new URL(path.href + suffix);
        if (existsSync(fileURLToPath(url))) {
          return nextResolve(url.href, context);
        }
      }
    }
    return nextResolve(specifier, context);
  },
});

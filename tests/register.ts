import { existsSync, readFileSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

// Resolve the application's existing ~/ alias without changing production imports.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("~/")) {
      const path = new URL(`../app/${specifier.slice(2)}`, import.meta.url);
      const candidates = [
        path.href,
        ...[".ts", ".tsx", ".json", "/index.ts", "/index.tsx"].map(
          (suffix) => path.href + suffix,
        ),
      ];
      for (const candidate of candidates) {
        const file = fileURLToPath(candidate);
        if (existsSync(file) && statSync(file).isFile()) {
          return nextResolve(candidate, context);
        }
      }
    }
    return nextResolve(specifier, context);
  },
  // Vite と同じように JSON をそのまま import できるようにする
  load(url, context, nextLoad) {
    if (url.endsWith(".json")) {
      return {
        format: "json",
        source: readFileSync(fileURLToPath(url), "utf8"),
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

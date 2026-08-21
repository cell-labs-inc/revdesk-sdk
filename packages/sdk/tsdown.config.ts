import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  // dts is emitted via oxc-transform (isolatedDeclarations is on in
  // tsconfig.json) — no TypeScript compiler API involved, which is what lets
  // this package build under typescript@7 (DEV-520).
  dts: true,
  clean: true,
  sourcemap: true,
  outExtensions: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".js" }),
});

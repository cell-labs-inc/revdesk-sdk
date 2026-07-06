import { base } from "@revdesk/eslint-config/base";

/**
 * @revdesk/sdk flat config. Without this, lint-staged falls back to the root
 * config and the type-aware parser can't pick a tsconfigRootDir (multiple
 * candidates), failing every commit that touches this package.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...base(import.meta.dirname),
  {
    // Generated from openapi.json — not hand-maintained, skip linting.
    ignores: ["src/generated/**", "dist/**"],
  },
];

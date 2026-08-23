#!/usr/bin/env bash
set -euo pipefail

package_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
monorepo_schema="$package_dir/../../apps/docs/openapi.json"
schema_source="${OPENAPI_SCHEMA_PATH:-$monorepo_schema}"

if [[ ! -f "$schema_source" && "$schema_source" == "$monorepo_schema" ]]; then
  schema_source="https://www.revdesk.com/openapi.json"
fi

# openapi-typescript uses the TypeScript JavaScript compiler API, while the
# monorepo uses TypeScript's native compiler package. Run the generator in an
# isolated directory with its compatible JS compiler instead of resolving the
# monorepo's `typescript` package.
generator_dir="$(mktemp -d "${TMPDIR:-/tmp}/revdesk-openapi-types.XXXXXX")"
trap 'rm -rf "$generator_dir"' EXIT

cd "$generator_dir"
npm exec --yes \
  --package=typescript@5.9.3 \
  --package=openapi-typescript@7.13.0 \
  -- openapi-typescript "$schema_source" -o "$package_dir/src/generated/openapi.ts"

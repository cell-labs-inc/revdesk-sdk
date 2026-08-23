#!/usr/bin/env bash
set -euo pipefail

package_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
monorepo_wrapper="$package_dir/../../scripts/dev/type-check.sh"

if [[ -f "$monorepo_wrapper" ]]; then
  exec bash "$monorepo_wrapper" tsc --noEmit
fi

exec tsc --noEmit

#!/usr/bin/env node

import { runCli } from "./cli-core";

declare const process: {
  argv: string[];
  env: Record<string, string | undefined>;
  exitCode?: number;
};

runCli(process.argv.slice(2), process.env, {
  fetch,
  stdout: (value) => console.log(value),
  stderr: (value) => console.error(value),
})
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });

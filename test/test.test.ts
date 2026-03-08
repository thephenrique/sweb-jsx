import test from "node:test";

import { transformSync } from "@babel/core";

import plugin from "../src";

test("should...", () => {
  const sourceCode = ``;

  const babelFileResult = transformSync(sourceCode, {
    filename: "File.tsx",
    plugins: [plugin],
    configFile: false,
    babelrc: false,
  });

  console.log(babelFileResult?.code?.trim());
});

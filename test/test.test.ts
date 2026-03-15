// import assert from "node:assert";
import test from "node:test";

import { transformSync } from "@babel/core";

import plugin from "../src";

test("should...", () => {
  const sourceCode = `
    function MyComponent0() {
      return (
        <div></div>
      );
    }

    function MyComponent1() {
      return (
        <p></p>
      );
    }

    function MyComponent2() {
      return (
        <div></div>
      );
    }
  `;

  //   const expected = `import { makeTemplateCreator as _makeTemplateCreator } from "sweb-dom";
  // var _createTemplate = /*#__PURE__*/_makeTemplateCreator(\`<div>\`),
  //   _createTemplate2 = /*#__PURE__*/_makeTemplateCreator(\`<p>\`);
  // function MyComponent0() {
  //   return _createTemplate();
  // }
  // function MyComponent1() {
  //   return _createTemplate2();
  // }
  // function MyComponent2() {
  //   return _createTemplate();
  // }`;

  const babelFileResult = transformSync(sourceCode, {
    filename: "MyComponents.tsx",
    plugins: [plugin],
  });

  console.log(babelFileResult?.code?.trim());

  // assert.equal(babelFileResult?.code?.trim(), expected);
});

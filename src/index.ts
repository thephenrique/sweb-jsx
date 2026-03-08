import type { PluginObj } from "@babel/core";
import SyntaxJSX from "@babel/plugin-syntax-jsx";

import { compileJSXNode } from "./compiler";
import type { PluginState } from "./plugin-state";

function plugin(): PluginObj<PluginState> {
  return {
    name: "sweb-jsx",
    inherits: SyntaxJSX.default,
    visitor: {
      JSXElement: compileJSXNode,
      JSXFragment: compileJSXNode,
      // Program: {
      //   enter: () => {},
      //   exit: () => {},
      // },
    },
  };
}

export default plugin;

import type { PluginObj } from "@babel/core";
import SyntaxJSX from "@babel/plugin-syntax-jsx";

import { compileJSXNode, handlePluginExit } from "./compiler";
import type { PluginState } from "./plugin-state";

function plugin(): PluginObj<PluginState> {
  return {
    name: "sweb-jsx",
    inherits: SyntaxJSX.default,
    visitor: {
      Program: {
        enter: () => {},
        exit: handlePluginExit,
      },
      JSXElement: compileJSXNode,
      JSXFragment: compileJSXNode,
    },
  };
}

export default plugin;

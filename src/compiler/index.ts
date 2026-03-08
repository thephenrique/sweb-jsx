import type { NodePath } from "@babel/core";
import { isJSXFragment, type JSXElement, type JSXFragment } from "@babel/types";

import type { PluginState } from "../plugin-state";
import { createIntermediateRepresentationNode } from "./create-intermediate-representation-node";
import { createReplacementNode } from "./create-replacement-node";

/**
 * Entry point.
 * Compiles a single JSX node to JavaScript.
 * It is called for each instance of JSXElement or JSXFragment found in the AST provided by Babel.
 */
export function compileJSXNode(path: NodePath<JSXElement | JSXFragment>, state: PluginState): void {
  if (state.skipCompilation) {
    return;
  }

  const irNode = createIntermediateRepresentationNode(
    path,
    state,
    isJSXFragment(path.node) ? {} : { isTopLevel: true, isLastElement: true },
  );

  /* const replacementNode = */ createReplacementNode(path, state, irNode);
  // path.replaceWith(replacementNode);

  // TODO: Clean up `@once`.
}

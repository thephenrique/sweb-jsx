import type { NodePath } from "@babel/core";
import type { JSXElement, JSXFragment } from "@babel/types";

import type { PluginState } from "../plugin-state";
import type { IntermediateRepresentationNode } from "./types";

/**
 * Generates the JavaScript AST that will replace the original JSX,
 * from the intermediate representation.
 */
export function createReplacementNode(
  _path: NodePath<JSXElement | JSXFragment>,
  _state: PluginState,
  _irNode: IntermediateRepresentationNode,
): NodePath {
  throw new Error();
}

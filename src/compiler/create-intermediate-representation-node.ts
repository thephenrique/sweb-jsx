import type { NodePath } from "@babel/core";

import { getPluginOptions, type PluginState } from "../plugin-state";
import { createElementIRNode } from "./create-element-ir-node";
import { createExpressionContainerIRNode } from "./create-expression-container-ir-node";
import { createFragmentIRNode } from "./create-fragment-ir-node";
import { createSpreadChildIRNode } from "./create-spread-child-ir-node";
import { createTextIRNode } from "./create-text-ir-node";
import type { IntermediateRepresentationNode, JSXNode } from "./types";

type IntermediateRepresentationOptions = {
  isTopLevel?: boolean;
  isLastElement?: boolean;
};

// Orchestrator.
export function createIntermediateRepresentationNode(
  path: NodePath<JSXNode>,
  state: PluginState,
  _options?: IntermediateRepresentationOptions,
): IntermediateRepresentationNode {
  getPluginOptions(state);

  if (path.isJSXElement()) {
    return createElementIRNode(path);
  }

  if (path.isJSXFragment()) {
    return createFragmentIRNode();
  }

  if (path.isJSXText()) {
    return createTextIRNode();
  }

  if (path.isJSXExpressionContainer()) {
    return createExpressionContainerIRNode();
  }

  if (path.isJSXSpreadChild()) {
    return createSpreadChildIRNode();
  }

  throw new Error("Unsupported node type");
}

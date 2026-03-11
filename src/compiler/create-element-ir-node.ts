import type { NodePath } from "@babel/core";
import { type JSXElement } from "@babel/types";

import { foldConstantToLiteral, getElementName, isComponentElement } from "./helpers";
import type { IntermediateRepresentationNode } from "./types";

// Orchestrator.
export function createElementIRNode(path: NodePath<JSXElement>): IntermediateRepresentationNode {
  return isComponentElement(getElementName())
    ? createComponentElementIRNode()
    : createDOMElementIRNode(path);
}

// Creator.
function createComponentElementIRNode(): IntermediateRepresentationNode {
  return {};
}

// Creator.
function createDOMElementIRNode(path: NodePath<JSXElement>): IntermediateRepresentationNode {
  path
    .get("openingElement")
    .get("attributes")
    .forEach((attribute) => {
      if (!attribute.isJSXAttribute()) {
        return;
      }

      foldConstantToLiteral(attribute.get("value") as NodePath);
    });

  return {};
}

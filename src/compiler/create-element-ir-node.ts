import type { NodePath } from "@babel/core";
import { type JSXElement } from "@babel/types";

import { getElementName, isComponentElement } from "./helpers";
import type { IntermediateRepresentationNode } from "./types";

// Orchestrator.
export function createElementIRNode(path: NodePath<JSXElement>): IntermediateRepresentationNode {
  return isComponentElement(getElementName(path))
    ? createComponentElementIRNode()
    : createHtmlElementIRNode(path);
}

// Creator.
function createComponentElementIRNode(): IntermediateRepresentationNode {
  throw new Error("Not Implemented");
}

// Creator.
function createHtmlElementIRNode(path: NodePath<JSXElement>): IntermediateRepresentationNode {
  const elementName = getElementName(path);

  const irNode: IntermediateRepresentationNode = {
    identifier: path.scope.generateUidIdentifier("element"),

    htmlContent: `<${elementName}>`,

    variables: [],
  };

  return irNode;
}

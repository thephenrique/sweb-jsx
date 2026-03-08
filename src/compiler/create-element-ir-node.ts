import { getElementName, isComponentElement } from "./helpers";
import type { IntermediateRepresentationNode } from "./types";

// Orchestrator.
export function createElementIRNode(): IntermediateRepresentationNode {
  return isComponentElement(getElementName())
    ? createComponentElementIRNode()
    : createDOMElementIRNode();
}

// Creator.
function createComponentElementIRNode(): IntermediateRepresentationNode {
  return {};
}

// Creator.
function createDOMElementIRNode(): IntermediateRepresentationNode {
  return {};
}

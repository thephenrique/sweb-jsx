import type { NodePath } from "@babel/core";
import {
  callExpression,
  variableDeclaration,
  variableDeclarator,
  type Identifier,
  type JSXElement,
  type JSXFragment,
  type Node,
} from "@babel/types";

import type { PluginState } from "../plugin-state";
import { cacheTemplate } from "./helpers";
import type { IntermediateRepresentationNode } from "./types";

/**
 * Generates the JavaScript AST that will replace the original JSX,
 * from the intermediate representation.
 */
export function createReplacementNode(
  path: NodePath<JSXElement | JSXFragment>,
  _state: PluginState,
  irNode: IntermediateRepresentationNode,
): Node {
  handleTemplate(path, irNode);

  return irNode.variables[0]!.init!;
}

function handleTemplate(
  path: NodePath<JSXElement | JSXFragment>,
  irNode: IntermediateRepresentationNode,
) {
  const templateCreatorFnIdentifier = cacheTemplate(path, irNode);
  declareTemplateCreatorFn(templateCreatorFnIdentifier, irNode);
}

function declareTemplateCreatorFn(
  fnIdentifier: Identifier,
  irNode: IntermediateRepresentationNode,
) {
  irNode.variableDeclaration = variableDeclaration("var", irNode.variables);
  irNode.variables.unshift(variableDeclarator(irNode.identifier, callExpression(fnIdentifier, [])));
}

import type { NodePath } from "@babel/core";
import {
  addComment,
  callExpression,
  templateElement,
  templateLiteral,
  variableDeclaration,
  variableDeclarator,
  type JSXElement,
  type JSXFragment,
  type Program,
} from "@babel/types";

import type { PluginState } from "../plugin-state";
import { createIntermediateRepresentationNode } from "./create-intermediate-representation-node";
import { createReplacementNode } from "./create-replacement-node";
import { cacheImport, escapeForTemplateLiteral, getTemplatesCache } from "./helpers";

/**
 * Compiles a single JSX node to JavaScript.
 *
 * It is called for each instance of JSXElement or JSXFragment found in the AST provided by Babel.
 */
export function compileJSXNode(path: NodePath<JSXElement | JSXFragment>, state: PluginState): void {
  if (state.skipCompilation) {
    return;
  }

  path.replaceWith(
    createReplacementNode(path, state, createIntermediateRepresentationNode(path, state)),
  );

  // TODO: Clean up `@once`.
}

export function handlePluginExit(path: NodePath<Program>, state: PluginState): void {
  if (state.skipCompilation) {
    return;
  }

  const templatesCache = getTemplatesCache(path);

  if (templatesCache.length === 0) {
    return;
  }

  const variables = templatesCache.map((template) => {
    const namedImportIdentifier = cacheImport(path, "makeTemplateCreator");
    const htmlContent = templateLiteral(
      [templateElement({ raw: escapeForTemplateLiteral(template.htmlContent) })],
      [],
    );

    return variableDeclarator(
      template.identifier,
      addComment(callExpression(namedImportIdentifier, [htmlContent]), "leading", "#__PURE__"),
    );
  });

  path.node.body.unshift(variableDeclaration("var", variables));
}

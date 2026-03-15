import type {
  Identifier,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
  VariableDeclaration,
  VariableDeclarator,
} from "@babel/types";

export type IntermediateRepresentationNode = {
  identifier: Identifier;

  /** Without the closing tags. The result is a shorter string used at runtime. */
  htmlContent: string;

  variables: VariableDeclarator[];
  variableDeclaration?: VariableDeclaration;
};

export type JSXNode = JSXElement | JSXFragment | JSXText | JSXExpressionContainer | JSXSpreadChild;

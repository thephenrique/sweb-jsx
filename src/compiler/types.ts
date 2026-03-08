import type {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
} from "@babel/types";

export type IntermediateRepresentationNode = {};

export type JSXNode = JSXElement | JSXFragment | JSXText | JSXExpressionContainer | JSXSpreadChild;

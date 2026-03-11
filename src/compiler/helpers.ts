import type { NodePath } from "@babel/core";
import {
  booleanLiteral,
  numericLiteral,
  stringLiteral,
  type JSXElement,
  type JSXIdentifier,
  type JSXMemberExpression,
  type JSXNamespacedName,
} from "@babel/types";

// Helper.
export function isComponentElement(_elementName: string): boolean {
  return true;
}

/**
 * Returns the element tag name from JSX node.
 *
 * Handles JSX Identifiers and NamespacedNames directly, and
 * recursively descends through JSX MemberExpressions to build
 * their full string representation.
 *
 * Important to normalize element names into a single string form
 * for later element classification and transform decisions.
 *
 * Examples:
 * - <div /> -> "div"
 * - <MyComponent /> -> "MyComponent"
 * - <Foo.Bar.Baz /> -> "Foo.Bar.Baz"
 * - <svg:path /> -> "svg:path"
 */
export function getElementTagName(path: NodePath<JSXElement>): string {
  return getElementTagNameHelper(path.get("openingElement").get("name"));
}

function getElementTagNameHelper(
  path: NodePath<JSXIdentifier | JSXMemberExpression | JSXNamespacedName>,
): string {
  if (path.isJSXIdentifier() || path.isIdentifier()) {
    // Ex.: <div /> -> "div"
    return path.node.name;
  }

  if (path.isJSXMemberExpression()) {
    // Ex.: <Foo.Bar.Baz /> -> "Foo.Bar.Baz"
    return `${getElementTagNameHelper(path.get("object"))}.${path.node.property.name}`;
  }

  if (path.isJSXNamespacedName()) {
    // Ex.: <svg:path /> -> "svg:path"
    return `${path.node.namespace.name}:${path.node.name.name}`;
  }

  throw new Error("Unsupported element tag name");
}

/**
 * Performs constant folding on JSX node.
 *
 * Recursively descends through JSX ExpressionContainers and ObjectLiterals,
 * evaluates statically known expressions, and replaces them with native
 * literal nodes when evaluation is confident by Babel.
 *
 * Important to simplify values by folding expressions that can be
 * safely evaluated at build time.
 *
 * Confident examples:
 * - {"a" + "b"} -> {"ab"}
 * - {1 + 2} -> {3}
 * - {true && false} -> {false}
 * - {{ count: 1 + 2 }} -> {{ count: 3 }}
 */
export function foldConstantToLiteral(path: NodePath) {
  // Skip. Already literal.
  if (
    path.isStringLiteral() ||
    path.isNumericLiteral() ||
    path.isBooleanLiteral() ||
    path.isNullLiteral()
  ) {
    return;
  }

  if (path.isJSXExpressionContainer()) {
    foldConstantToLiteral(path.get("expression"));
    return;
  }

  if (path.isObjectProperty()) {
    foldConstantToLiteral(path.get("value"));
    return;
  }

  if (path.isObjectExpression()) {
    path.get("properties").forEach((property) => {
      foldConstantToLiteral(property);
    });
    return;
  }

  const evaluation = path.evaluate();

  if (!evaluation.confident) {
    return;
  }

  if (typeof evaluation.value === "string") {
    // Ex.: {"a" + "b"} -> {"ab"}
    path.replaceWith(stringLiteral(evaluation.value));
    return;
  }

  if (typeof evaluation.value === "number") {
    // Ex.: {1 + 2} -> {3}
    path.replaceWith(numericLiteral(evaluation.value));
    return;
  }

  if (typeof evaluation.value === "boolean") {
    // Ex.: {true && false} -> {false}
    path.replaceWith(booleanLiteral(evaluation.value));
    return;
  }
}

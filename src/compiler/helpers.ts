import type { NodePath } from "@babel/core";
import { addNamed as createNamedImport } from "@babel/helper-module-imports";
import {
  cloneNode,
  type Identifier,
  type JSXElement,
  type JSXIdentifier,
  type JSXMemberExpression,
  type JSXNamespacedName,
} from "@babel/types";

import type { IntermediateRepresentationNode } from "./types";

// Helper.
export function isComponentElement(_elementName: string): boolean {
  return false;
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
export function getElementName(path: NodePath<JSXElement>): string {
  return getElementNameHelper(path.get("openingElement").get("name"));
}

type Template = {
  identifier: Identifier;

  /** Without the closing tags, the result is a shorter string at runtime. */
  htmlContent: string;
};

function getElementNameHelper(
  path: NodePath<JSXIdentifier | JSXMemberExpression | JSXNamespacedName>,
): string {
  if (path.isJSXIdentifier() || path.isIdentifier()) {
    // Ex.: <div /> -> "div"
    return path.node.name;
  }

  if (path.isJSXMemberExpression()) {
    // Ex.: <Foo.Bar.Baz /> -> "Foo.Bar.Baz"
    return `${getElementNameHelper(path.get("object"))}.${path.node.property.name}`;
  }

  if (path.isJSXNamespacedName()) {
    // Ex.: <svg:path /> -> "svg:path"
    return `${path.node.namespace.name}:${path.node.name.name}`;
  }

  throw new Error("Unsupported element tag name");
}

export function getTemplatesCache(path: NodePath): Template[] {
  const programScope = path.scope.getProgramParent();

  if (!Array.isArray(programScope.data.templates)) {
    programScope.data.templates = [];
  }

  return programScope.data.templates as Template[];
}

export function cacheTemplate(path: NodePath, irNode: IntermediateRepresentationNode): Identifier {
  const templatesCache = getTemplatesCache(path);
  const existingTemplate = templatesCache.find(
    (template) => template.htmlContent === irNode.htmlContent,
  );

  if (existingTemplate) {
    return existingTemplate.identifier;
  }

  const templateCreatorFnIdentifier = path.scope.generateUidIdentifier("createTemplate");

  templatesCache.push({
    identifier: templateCreatorFnIdentifier,
    htmlContent: irNode.htmlContent,
  });

  return templateCreatorFnIdentifier;
}

function getImportsCache(path: NodePath): Map<string, Identifier> {
  const programScope = path.scope.getProgramParent();

  if (!(programScope.data.imports instanceof Map)) {
    programScope.data.imports = new Map();
  }

  return programScope.data.imports as Map<string, Identifier>;
}

export function cacheImport(path: NodePath, importingIdentifierName: string): Identifier {
  const moduleName = "sweb-dom";
  const importsCache = getImportsCache(path);

  const key = `${moduleName}:${importingIdentifierName}`;

  if (importsCache.has(key)) {
    const namedImportIdentifier = importsCache.get(key)!;

    return cloneNode(namedImportIdentifier);
  }

  const namedImportIdentifier = createNamedImport(path, importingIdentifierName, moduleName);
  importsCache.set(key, namedImportIdentifier);

  return namedImportIdentifier;
}

export function escapeForTemplateLiteral(string: string) {
  const templateEscapes = new Map([
    ["{", "\\{"],
    ["`", "\\`"],
    ["\\", "\\\\"],
    ["\n", "\\n"],
    ["\t", "\\t"],
    ["\b", "\\b"],
    ["\f", "\\f"],
    ["\v", "\\v"],
    ["\r", "\\r"],
    ["\u2028", "\\u2028"],
    ["\u2029", "\\u2029"],
  ]);

  return string.replace(/[{\\`\n\t\b\f\v\r\u2028\u2029]/g, (char) => templateEscapes.get(char)!);
}

import { parse } from "@babel/parser";

export function parseAST(code, filepath) {
  try {
    return parse(code, {
      sourceType: "unambiguous",
      plugins: [
        "jsx",
        "typescript",
        "classProperties",
        "dynamicImport",
        "optionalChaining",
        "nullishCoalescingOperator"
      ]
    });
  } catch (err) {
    return null;
  }
}
import { Environment } from "./environment";

export function interpret(ast: any, env: Environment): any {
  if (!ast) return null;

  if (ast.type === "Program") {
    const results: any[] = [];
    for (const statement of ast.statements) {
      const res = interpret(statement, env);
      if (res) results.push(res);
    }
    return results;
  }

  if (ast.type === "LetStatement") {
    const value = interpret(ast.value, env);
    env.set(ast.name.value, value);
    return null; 
  }

  if (ast.type === "Identifier") {
    return env.get(ast.value);
  }

  if (ast.type === "MoveStatement") {
    const steps = interpret(ast.steps, env);
    return { type: "Move", payload: steps };
  }

  if (ast.type === "TurnStatement") {
    const direction = interpret(ast.direction, env);
    return { type: "Turn", payload: direction };
  }

  if (ast.type === "IntegerLiteral") {
    return ast.value;
  }

  if (ast.type === "StringLiteral") {
    return ast.value;
  }

  return null;
}
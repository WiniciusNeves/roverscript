import { Environment } from "./environment";
import { Rover } from "../simulator/rover";

export function interpret(ast: any, env: Environment, rover: Rover): any {
  if (!ast) return null;

  if (ast.type === "Program" || ast.type === "BlockStatement") {
    const results: any[] = [];
    for (const statement of ast.statements) {
      const res = interpret(statement, env, rover);
      if (res && Array.isArray(res)) results.push(...res);
      else if (res) results.push(res);
    }
    return results;
  }

  if (ast.type === "RepeatStatement") {
    const count = interpret(ast.count, env, rover);
    const results: any[] = [];
    for (let i = 0; i < count; i++) {
      const res = interpret(ast.body, env, rover);
      if (res && Array.isArray(res)) results.push(...res);
      else if (res) results.push(res);
    }
    return results;
  }

  if (ast.type === "IfStatement") {
    let isConditionMet = false;

    if (ast.condition && ast.condition.type === "Identifier" && ast.condition.value === "obstacle") {
      isConditionMet = rover.detectObstacle(0, 0);
    } else if (ast.condition) {
      const conditionValue = interpret(ast.condition, env, rover);
      isConditionMet = !!conditionValue;
    }

    if (isConditionMet) {
      return interpret(ast.consequence, env, rover);
    } else if (ast.alternative) {
      return interpret(ast.alternative, env, rover);
    }
    return null;
  }

  if (ast.type === "PlaceObstacleStatement") {
    const x = interpret(ast.x, env, rover);
    const y = interpret(ast.y, env, rover);
    
    if (typeof x === "number" && typeof y === "number") {
      rover.addObstacle(x, y);
    }
    
    return { type: "PlaceObstacle", payload: { x, y } };
  }

  if (ast.type === "LetStatement") {
    const value = interpret(ast.value, env, rover);
    env.set(ast.name.value, value);
    return null;
  }

  if (ast.type === "Identifier") return env.get(ast.value);
  if (ast.type === "IntegerLiteral") return ast.value;
  if (ast.type === "StringLiteral") return ast.value;

 if (ast.type === "MoveStatement") {
    const requestedSteps = interpret(ast.steps, env, rover);
    const actualSteps = rover.move(requestedSteps);
    return { type: "Move", payload: actualSteps, requested: requestedSteps };
  }

  if (ast.type === "TurnStatement") {
    const direction = interpret(ast.direction, env, rover);
    rover.turn(direction);
    return { type: "Turn", payload: direction };
  }

  return null;
}

import { Token } from "./types";

export interface Node {
  type: string;
  tokenLiteral(): string;
}

export interface Statement extends Node {
  statementNode(): void;
}

export interface Expression extends Node {
  expressionNode(): void;
}

export class Program implements Node {
  type = "Program";
  statements: Statement[] = [];

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return "";
  }
}

export class Identifier implements Expression {
  type = "Identifier";
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  expressionNode(): void {}
  tokenLiteral(): string { return this.token.literal; }
}

export class LetStatement implements Statement {
  type = "LetStatement";
  token: Token;
  name: Identifier;
  value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  statementNode(): void {}
  tokenLiteral(): string { return this.token.literal; }
}

export class MoveStatement implements Statement {
  type = "MoveStatement";
  token: Token;
  steps: Expression;

  constructor(token: Token, steps: Expression) {
    this.token = token;
    this.steps = steps;
  }

  statementNode(): void {}
  tokenLiteral(): string { return this.token.literal; }
}

export class TurnStatement implements Statement {
  type = "TurnStatement";
  token: Token;
  direction: Expression;

  constructor(token: Token, direction: Expression) {
    this.token = token;
    this.direction = direction;
  }

  statementNode(): void {}
  tokenLiteral(): string { return this.token.literal; }
}

export class IntegerLiteral implements Expression {
  type = "IntegerLiteral";
  token: Token;
  value: number;

  constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
  }

  expressionNode(): void {}
  tokenLiteral(): string { return this.token.literal; }
}

export class StringLiteral implements Expression {
  type = "StringLiteral";
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  expressionNode(): void {}
  tokenLiteral(): string { return this.token.literal; }
}

export class PlaceObstacleStatement implements Statement {
  type = "PlaceObstacleStatement"
  token: Token;
  x: Expression
  y: Expression;

  constructor(token: Token, x: Expression, y: Expression) {
    this.token = token;
    this.x = x;
    this.y = y;
  }

  statementNode(): void {}
  tokenLiteral(): string { return this.token.literal; }
}
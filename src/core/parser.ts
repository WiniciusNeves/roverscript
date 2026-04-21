import { Lexer } from "./lexer";
import { Token, TokenType } from "./types";
import {
  Program,
  Statement,
  MoveStatement,
  TurnStatement,
  Expression,
  IntegerLiteral,
  StringLiteral,
  LetStatement,
  Identifier
} from "./ast";

export class Parser {
  private lexer: Lexer;
  private currentToken: Token;
  private peekToken: Token;
  private errors: string[] = [];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.currentToken = { type: TokenType.EOF, literal: "" };
    this.peekToken = { type: TokenType.EOF, literal: "" };

    this.nextToken();
    this.nextToken();
  }

  public getErrors(): string[] {
    return this.errors;
  }

  private nextToken(): void {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  public parseProgram(): Program {
    const program = new Program();

    while (this.currentToken.type !== TokenType.EOF) {
      const statement = this.parseStatement();
      if (statement !== null) {
        program.statements.push(statement);
      }
      this.nextToken();
    }

    return program;
  }

  private parseStatement(): Statement | null {
    switch (this.currentToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      case TokenType.MOVE:
        return this.parseMoveStatement();
      case TokenType.TURN:
        return this.parseTurnStatement();
      default:
        return null;
    }
  }

  private parseLetStatement(): LetStatement | null {
    const token = this.currentToken;

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    const name = new Identifier(this.currentToken, this.currentToken.literal);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    this.nextToken();

    const value = this.parseExpression();

    return new LetStatement(token, name, value as Expression);
  }

  private parseMoveStatement(): MoveStatement | null {
    const token = this.currentToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();

    const steps = this.parseExpression();

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return new MoveStatement(token, steps as Expression);
  }

  private parseTurnStatement(): TurnStatement | null {
    const token = this.currentToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();

    const direction = this.parseExpression();

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return new TurnStatement(token, direction as Expression);
  }

  private parseExpression(): Expression | null {
    if (this.currentToken.type === TokenType.INT) {
      const value = parseInt(this.currentToken.literal, 10);
      return new IntegerLiteral(this.currentToken, value);
    }
    if (this.currentToken.type === TokenType.STRING) {
      return new StringLiteral(this.currentToken, this.currentToken.literal);
    }
    if (this.currentToken.type === TokenType.IDENT) {
      return new Identifier(this.currentToken, this.currentToken.literal);
    }
    return null;
  }

  private expectPeek(type: TokenType): boolean {
    if (this.peekToken.type === type) {
      this.nextToken();
      return true;
    } else {
      this.peekError(type);
      return false;
    }
  }

  private peekError(type: TokenType): void {
    const msg = `Esperado próximo token ser ${type}, mas foi ${this.peekToken.type}`;
    this.errors.push(msg);
  }
}
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
  Identifier,
} from "./ast";

export class Parser {
  private lexer: Lexer;
  private currentToken: Token;
  private peekToken: Token;
  private errors: string[] = [];

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.currentToken = {
      type: TokenType.EOF,
      literal: "",
      line: 0,
      column: 0,
    };
    this.peekToken = { type: TokenType.EOF, literal: "", line: 0, column: 0 };

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
      case TokenType.REPEAT:
        return this.parseRepeatStatement();
      case TokenType.IF:
        return this.parseIfStatement();
      case TokenType.ELSE:
        return this.parseIfStatement();
      case TokenType.PLACE_OBSTACLE:
        return this.parsePlaceObstacleStatement();
      default:
        this.errors.push(
          `Linha ${this.currentToken.line}: Comando ou sintaxe não reconhecida '${this.currentToken.literal}'.`,
        );
        return null;
    }
  }

  private parseLetStatement(): LetStatement | null {
    const token = this.currentToken;

    if (!this.expectPeek(TokenType.IDENT)) return null;

    const name = new Identifier(this.currentToken, this.currentToken.literal);

    if (!this.expectPeek(TokenType.ASSIGN)) return null;

    this.nextToken();
    const value = this.parseExpression();

    return new LetStatement(token, name, value as Expression);
  }

  private parseMoveStatement(): MoveStatement | null {
    const token = this.currentToken;

    if (!this.expectPeek(TokenType.LPAREN)) return null;

    this.nextToken();
    const steps = this.parseExpression();

    if (!this.expectPeek(TokenType.RPAREN)) return null;

    return new MoveStatement(token, steps as Expression);
  }

  private parseTurnStatement(): TurnStatement | null {
    const token = this.currentToken;

    if (!this.expectPeek(TokenType.LPAREN)) return null;

    this.nextToken();
    const direction = this.parseExpression();

    if (!this.expectPeek(TokenType.RPAREN)) return null;

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
    if (
      this.currentToken.type === TokenType.IDENT ||
      this.currentToken.type === TokenType.OBSTACLE
    ) {
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
    const msg = `Linha ${this.peekToken.line}: Esperava encontrar '${type}', mas encontrou '${this.peekToken.literal}'`;
    this.errors.push(msg);
  }

  private parseBlockStatement(): any {
    const token = this.currentToken;
    const statements: Statement[] = [];

    this.nextToken();

    while (
      this.currentToken.type !== TokenType.RBRACE &&
      this.currentToken.type !== TokenType.EOF
    ) {
      const stmt = this.parseStatement();
      if (stmt !== null) {
        statements.push(stmt);
      }
      this.nextToken();
    }

    return { type: "BlockStatement", token, statements };
  }

  private parseRepeatStatement(): any {
    const token = this.currentToken;
    if (!this.expectPeek(TokenType.LPAREN)) return null;
    this.nextToken();
    const count = this.parseExpression();
    if (!this.expectPeek(TokenType.RPAREN)) return null;
    if (!this.expectPeek(TokenType.LBRACE)) return null;

    const body = this.parseBlockStatement();
    return { type: "RepeatStatement", token, count, body };
  }

  private parseIfStatement(): any {
    const token = this.currentToken;
    if (!this.expectPeek(TokenType.LPAREN)) return null;
    this.nextToken();
    const condition = this.parseExpression();
    if (!this.expectPeek(TokenType.RPAREN)) return null;
    if (!this.expectPeek(TokenType.LBRACE)) return null;

    const consequence = this.parseBlockStatement();
    let alternative = null;

    if (this.peekToken.type === TokenType.ELSE) {
      this.nextToken();
      if (!this.expectPeek(TokenType.LBRACE)) return null;
      alternative = this.parseBlockStatement();
    }

    return { type: "IfStatement", token, condition, consequence, alternative };
  }

  private parsePlaceObstacleStatement(): any {
    const token = this.currentToken;
    if (!this.expectPeek(TokenType.LPAREN)) return null;
    this.nextToken();
    const x = this.parseExpression();
    if (!this.expectPeek(TokenType.COMMA)) return null;
    this.nextToken();
    const y = this.parseExpression();
    if (!this.expectPeek(TokenType.RPAREN)) return null;

    return { type: "PlaceObstacleStatement", token, x, y };
  }
}

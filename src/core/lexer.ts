import { Token, TokenType } from "./types";

const keywords: Record<string, TokenType> = {
  mission: TokenType.MISSION,
  let: TokenType.LET,
  if: TokenType.IF,
  else: TokenType.ELSE,
  repeat: TokenType.REPEAT,
  move: TokenType.MOVE,
  back: TokenType.BACK,
  turn: TokenType.TURN,
  detect: TokenType.DETECT,
  obstacle: TokenType.OBSTACLE,
  placeObstacle: TokenType.PLACE_OBSTACLE
};

export class Lexer {
  private input: string;
  private position: number = 0;
  private readPosition: number = 0;
  private ch: string = "";

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  public nextToken(): Token {
    let token: Token;

    this.skipWhitespace();

    switch (this.ch) {
      case "=":
        token = this.newToken(TokenType.ASSIGN, this.ch);
        break;
      case "(":
        token = this.newToken(TokenType.LPAREN, this.ch);
        break;
      case ")":
        token = this.newToken(TokenType.RPAREN, this.ch);
        break;
      case "{":
        token = this.newToken(TokenType.LBRACE, this.ch);
        break;
      case "}":
        token = this.newToken(TokenType.RBRACE, this.ch);
        break;
      case ",":
        token = this.newToken(TokenType.COMMA, this.ch);
        break;
      case "\0":
        token = this.newToken(TokenType.EOF, "");
        break;
      case '"':
        token = this.newToken(TokenType.STRING, this.readString());
        break;
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const type = this.lookupIdent(literal);
          return this.newToken(type, literal);
        } else if (this.isDigit(this.ch)) {
          return this.newToken(TokenType.INT, this.readNumber());
        } else {
          token = this.newToken(TokenType.ILLEGAL, this.ch);
        }
    }

    this.readChar();
    return token;
  }

  private readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = "\0";
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private readIdentifier(): string {
    const position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private readNumber(): string {
    const position = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private readString(): string {
    const position = this.position + 1;
    this.readChar();
    while (this.ch !== '"' && this.ch !== "\0") {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private skipWhitespace(): void {
    while (
      this.ch === " " ||
      this.ch === "\t" ||
      this.ch === "\n" ||
      this.ch === "\r"
    ) {
      this.readChar();
    }
  }

  private isLetter(ch: string): boolean {
    return (
      (ch >= "a" && ch <= "z") ||
      (ch >= "A" && ch <= "Z") ||
      ch === "_"
    );
  }

  private isDigit(ch: string): boolean {
    return ch >= "0" && ch <= "9";
  }

  private lookupIdent(ident: string): TokenType {
    return keywords[ident] || TokenType.IDENT;
  }

  private newToken(type: TokenType, literal: string): Token {
    return { type, literal };
  }
}
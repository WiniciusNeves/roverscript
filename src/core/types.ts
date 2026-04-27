export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",

  IDENT = "IDENT",
  INT = "INT",
  STRING = "STRING",

  ASSIGN = "=",
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  COMMA = ",",

  MISSION = "MISSION",
  LET = "LET",
  IF = "IF",
  REPEAT = "REPEAT",
  MOVE = "MOVE",
  BACK = "BACK",
  TURN = "TURN",
  DETECT = "DETECT",
  OBSTACLE = "OBSTACLE",
  PLACE_OBSTACLE = "PLACE_OBSTACLE",
  ELSE = "ELSE"
}

export interface Token {
  type: TokenType;
  literal: string;
  line: number;
  column: number;
}
export interface AST {
  type: string;
  tokenLiteral(): string;
}
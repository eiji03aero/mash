import { IToken } from "./types";

export const newToken = (): IToken => ({
  type: "",
  literal: "",
});

export const tokens = {
  ILLEGAL: "ILLEGAL",
  NEWLINE: "NEWLINE",
  EOF: "EOF",

  IDENT: "IDENT",
  INT: "INT",
  STRING: "STRING",
  COMMANDLINE: "COMMANDLINE",

  ASSIGN: "=",
  COMMA: ",",
  COLON: ":",
  SEMICOLON: ";",

  // PLUS: "+",
  // MINUS: "-",
  // ASTERISK: "*",
  // SLASH: "/",
  // PERCENT: "%",

  DOLLAR: "$",
  D_LPAREN: "$(",
  AT: "@",
  HASH: "#",
  QUESTION: "?",
  BANG: "!",

  // LT: "<",
  // GT: ">",
  AND: "&&",
  OR: "||",

  PIPE: "|",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  // LBRACKET: "[",
  // RBRACKET: "]",

  // keywords
  FUNCTION: "FUNCTION",
};

const keywords: {[key: string]: string} = {
  function: tokens.FUNCTION,
};

type tokenString = typeof tokens[keyof typeof tokens];

export const lookUpIdent = (ident: string): tokenString => {
  return keywords[ident] || tokens.IDENT;
};

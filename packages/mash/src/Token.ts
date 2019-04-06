export type TokenType = string;

export interface Token {
  type: TokenType;
  literal: string;
}

export const newToken = (): Token => ({
  type: "",
  literal: "",
});

export const Tokens = {
  ILLEGAL: "ILLEGAL",
  NEWLINE: "NEWLINE",
  EOF: "EOF",

  IDENT: "IDENT",
  INT: "INT",
  STRING: "STRING",

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
  FUNCTION: "FUNCTION"
};

const Keywords: {[key: string]: string} = {
  function: Tokens.FUNCTION,
};

export const lookUpIdent = (ident: string) => {
  return Keywords[ident] || Tokens.IDENT;
};

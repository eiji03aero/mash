export type TokenType = string;
export interface IToken {
  type: TokenType;
  literal: string;
}

export interface ILexer {
  input: string;
  position: number;
  readPosition: number;
  ch: string;
  nextToken(): IToken;
}

export interface IParser {
  lexer: ILexer;
  errors: any;
  curToken: IToken;
  peekToken: IToken;
  parseProgram(): IProgram;
}

export interface IAstNode {
  tokenLiteral(): string;
  toString(): string;
}
export interface IProgram extends IAstNode {
  nodes: IAstNode[];
  append(node: IAstNode): void;
}
export interface ICommandLine extends IAstNode {
  command: IToken;
  args: IToken[];
}

export interface IEnv {

}

export interface IEvaluator {
  // TODO: update return type for eval
  eval(node: IAstNode, env: IEnv): any;
}

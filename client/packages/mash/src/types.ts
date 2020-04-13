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
  parseProgram(): IAstProgram;
}

export interface IAstNode {
  token: IToken;
  tokenLiteral(): string;
  toString(): string;
}

export interface IAstProgram extends IAstNode {
  nodes: IAstNode[];
  append(node: IAstNode): void;
}

export interface IAstCommandLine extends IAstNode {
  args: IAstNode[];
}

export interface IAstString extends IAstNode {
  value: string;
}

export enum ExitStatus {
  Success = 0,
  Failure = 1,
}

export type EnvironmentWriteHandler = (s: string) => void;

export interface IEnvironment {
  exitStatus: ExitStatus;
  onWriteln(cb: EnvironmentWriteHandler): void;
  writeln(input: string): void;
  reset(): void;
  error(code: ExitStatus, message?: string): void;
}

export interface IEvaluator {
  // TODO: update return type for eval
  // looking up builtins here
  eval(node: IAstNode): Promise<void>;
}

export interface IContext {
  _?: any;
}

export interface ICommandMap<T extends IContext> {
  [index: string]: CommandFunction<T>;
}

export interface ICommandPayload<T> {
  args: string[];
  environment: IEnvironment;
  context: T;
}

export type CommandFunction<T extends IContext> = (p: ICommandPayload<T>) => Promise<void>;

export interface ICommandOptionMap {
  [index: string]: string | boolean;
}

export interface IParsedCommandArgs {
  args: string[];
  options: ICommandOptionMap;
}

export interface IMashClient<T extends IContext> {
  eval(input: string, context: T): Promise<void>;
}

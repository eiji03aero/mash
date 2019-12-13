import {
  IFileSystem,
} from "mash-filesystem";

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

export interface ICommandPayload {
  args: string[];
  fileSystem: IFileSystem;
  environment: IEnvironment;
}

export interface ICommandOptionMap {
  [index: string]: string | boolean;
}

export interface IParsedCommandArgs {
  args: string[];
  options: ICommandOptionMap;
}

export type Command = (args: ICommandPayload) => void;

export interface ICommandMap {
  [index: string]: Command;
}

export type EnvironmentWriteHandler = (str: string) => void;

export interface IEnvironment {
  exitStatus: ExitStatus;
  error(code: ExitStatus, message?: string): void;
  writeln(str: string): void;
  eval(str: string): void;
  onWrite(func: EnvironmentWriteHandler): void;
}

export interface IEvaluator {
  // TODO: update return type for eval
  // looking up builtins here
  eval(node: IAstNode, env: IEnvironment): any;
}

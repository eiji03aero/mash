import { IFileSystem } from 'mash-filesystem';
import { text } from 'mash-common';
export declare type TokenType = string;
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
export declare enum ExitStatus {
    Success = 0,
    Failure = 1
}
export declare type CommandPayload = {
    args: IAstNode[];
    fileSystem: IFileSystem;
    environment: IEnvironment;
};
export declare type Command = (args: CommandPayload) => void;
export interface ICommandMap {
    [index: string]: Command;
}
export declare type EnvironmentWriteHandler = (row: text.Row) => void;
export interface IEnvironment {
    exitStatus: ExitStatus;
    error(code: ExitStatus, message?: string): void;
    writeln(row: text.Row): void;
    eval(str: string): void;
    onWrite(func: EnvironmentWriteHandler): void;
}
export interface IEvaluator {
    eval(node: IAstNode, env: IEnvironment): any;
}
//# sourceMappingURL=types.d.ts.map
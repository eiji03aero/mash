import { IToken, IAstNode, IProgram, ICommandLine } from './types';
export declare class Program implements IProgram {
    nodes: IAstNode[];
    constructor();
    append(node: IAstNode): void;
    tokenLiteral(): string;
    toString(): string;
}
export declare class CommandLine implements ICommandLine {
    args: IToken[];
    constructor(option: {
        tokens: IToken[];
    });
    tokenLiteral(): string;
    toString(): string;
}
//# sourceMappingURL=Ast.d.ts.map
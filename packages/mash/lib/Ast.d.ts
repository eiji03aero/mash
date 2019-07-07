import { Token } from "./Token";
export declare abstract class AstNode {
    constructor();
    abstract tokenLiteral(): string;
    abstract toString(): string;
}
export declare type Statement = AstNode | CommandLine;
export declare class Program extends AstNode {
    statements: Statement[];
    constructor();
    append(node: AstNode): void;
    tokenLiteral(): string;
    toString(): string;
}
export declare class CommandLine extends AstNode {
    command: Token;
    args: Token[];
    constructor(option: {
        tokens: Token[];
    });
    tokenLiteral(): string;
    toString(): string;
}
//# sourceMappingURL=Ast.d.ts.map
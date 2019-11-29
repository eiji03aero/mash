import { IToken, IAstNode, IAstProgram, IAstCommandLine, IAstString } from './types';
export declare class AstNode implements IAstNode {
    token: IToken;
    constructor(token: IToken);
    tokenLiteral(): string;
    toString(): string;
}
export declare class AstProgram extends AstNode implements IAstProgram {
    nodes: IAstNode[];
    constructor(token: IToken);
    append(node: IAstNode): void;
    tokenLiteral(): string;
    toString(): string;
}
export declare class AstCommandLine extends AstNode implements IAstCommandLine {
    args: IAstNode[];
    constructor(token: IToken, args: IAstNode[]);
    toString(): string;
}
export declare class AstString extends AstNode implements IAstString {
    value: string;
    constructor(token: IToken);
}
//# sourceMappingURL=Ast.d.ts.map
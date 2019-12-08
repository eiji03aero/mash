import * as A from "./Ast";
import { ILexer, IParser, IToken } from "./types";
export declare class Parser implements IParser {
    lexer: ILexer;
    errors: any;
    curToken: IToken;
    peekToken: IToken;
    constructor(lexer: ILexer);
    parseProgram(): A.AstProgram;
    private parseNode;
    private parseCommandLine;
    private nextToken;
    private curTokenIs;
}
//# sourceMappingURL=Parser.d.ts.map
import { Lexer } from "./Lexer";
import { Token } from "./Token";
import * as A from './Ast';
export declare class Parser {
    lexer: Lexer;
    errors: any;
    curToken: Token;
    peekToken: Token;
    constructor(lexer: Lexer);
    parseProgram(): A.Program;
    private parseStatement;
    private parseCommandLine;
    private nextToken;
    private curTokenIs;
}
//# sourceMappingURL=Parser.d.ts.map
import { IParser, IToken, ILexer } from './types';
import * as A from './Ast';
export declare class Parser implements IParser {
    lexer: ILexer;
    errors: any;
    curToken: IToken;
    peekToken: IToken;
    constructor(lexer: ILexer);
    parseProgram(): A.Program;
    private parseNode;
    private parseCommandLine;
    private nextToken;
    private curTokenIs;
}
//# sourceMappingURL=Parser.d.ts.map
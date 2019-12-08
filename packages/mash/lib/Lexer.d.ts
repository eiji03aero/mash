import { ILexer, IToken } from "./types";
export declare class Lexer implements ILexer {
    input: string;
    position: number;
    readPosition: number;
    ch: string;
    constructor(input: string);
    nextToken(): IToken;
    private get nextCharacter();
    private isSpace;
    private isNewLine;
    private isEOF;
    private skipSpace;
    private expectPeek;
    private readChar;
    private readString;
}
//# sourceMappingURL=Lexer.d.ts.map
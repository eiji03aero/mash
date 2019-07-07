import { Token } from "./Token";
export declare class Lexer {
    input: string;
    position: number;
    readPosition: number;
    ch: string;
    constructor(input: string);
    nextToken(): Token;
    private readonly nextCharacter;
    private isSpace;
    private isNewLine;
    private isEOF;
    private skipSpace;
    private expectPeek;
    private readChar;
    private readString;
}
//# sourceMappingURL=Lexer.d.ts.map
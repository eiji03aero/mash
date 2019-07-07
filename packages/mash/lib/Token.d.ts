export declare type TokenType = string;
export interface Token {
    type: TokenType;
    literal: string;
}
export declare const newToken: () => Token;
export declare const Tokens: {
    ILLEGAL: string;
    NEWLINE: string;
    EOF: string;
    IDENT: string;
    INT: string;
    STRING: string;
    ASSIGN: string;
    COMMA: string;
    COLON: string;
    SEMICOLON: string;
    DOLLAR: string;
    D_LPAREN: string;
    AT: string;
    HASH: string;
    QUESTION: string;
    BANG: string;
    AND: string;
    OR: string;
    PIPE: string;
    LPAREN: string;
    RPAREN: string;
    LBRACE: string;
    RBRACE: string;
    FUNCTION: string;
};
export declare const lookUpIdent: (ident: string) => string;
//# sourceMappingURL=Token.d.ts.map
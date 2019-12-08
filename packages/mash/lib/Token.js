"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = function () { return ({
    type: "",
    literal: "",
}); };
exports.tokens = {
    ILLEGAL: "ILLEGAL",
    NEWLINE: "NEWLINE",
    EOF: "EOF",
    IDENT: "IDENT",
    INT: "INT",
    STRING: "STRING",
    COMMANDLINE: "COMMANDLINE",
    ASSIGN: "=",
    COMMA: ",",
    COLON: ":",
    SEMICOLON: ";",
    // PLUS: "+",
    // MINUS: "-",
    // ASTERISK: "*",
    // SLASH: "/",
    // PERCENT: "%",
    DOLLAR: "$",
    D_LPAREN: "$(",
    AT: "@",
    HASH: "#",
    QUESTION: "?",
    BANG: "!",
    // LT: "<",
    // GT: ">",
    AND: "&&",
    OR: "||",
    PIPE: "|",
    LPAREN: "(",
    RPAREN: ")",
    LBRACE: "{",
    RBRACE: "}",
    // LBRACKET: "[",
    // RBRACKET: "]",
    // keywords
    FUNCTION: "FUNCTION",
};
var keywords = {
    function: exports.tokens.FUNCTION,
};
exports.lookUpIdent = function (ident) {
    return keywords[ident] || exports.tokens.IDENT;
};
//# sourceMappingURL=Token.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("./Token");
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.input = input;
        this.position = 0;
        this.readPosition = 0;
        this.ch = "";
        this.readChar();
    }
    Lexer.prototype.nextToken = function () {
        var tok = Token_1.newToken();
        this.skipSpace();
        switch (this.ch) {
            case "\n":
                tok.type = Token_1.tokens.NEWLINE;
                tok.literal = "\n";
                break;
            case "=":
                tok.type = Token_1.tokens.ASSIGN;
                tok.literal = "=";
                break;
            case "$":
                tok.type = Token_1.tokens.DOLLAR;
                tok.literal = "$";
                break;
            case "{":
                tok.type = Token_1.tokens.LBRACE;
                tok.literal = "{";
                break;
            case "}":
                tok.type = Token_1.tokens.RBRACE;
                tok.literal = "}";
                break;
            case "(":
                tok.type = Token_1.tokens.LPAREN;
                tok.literal = "(";
                break;
            case ")":
                tok.type = Token_1.tokens.RPAREN;
                tok.literal = ")";
                break;
            case "|":
                if (this.expectPeek("|")) {
                    this.readChar();
                    tok.type = Token_1.tokens.OR;
                    tok.literal = "||";
                }
                else {
                    tok.type = Token_1.tokens.PIPE;
                    tok.literal = "|";
                }
                break;
            case "&":
                this.readChar();
                tok.type = Token_1.tokens.AND;
                tok.literal = "&&";
                break;
            case ":":
                tok.type = Token_1.tokens.COLON;
                tok.literal = ":";
                break;
            case ";":
                tok.type = Token_1.tokens.SEMICOLON;
                tok.literal = ";";
                break;
            case "EOF":
                tok.type = Token_1.tokens.EOF;
                break;
            default:
                tok.type = Token_1.tokens.STRING;
                tok.literal = this.readString();
        }
        this.readChar();
        return tok;
    };
    Object.defineProperty(Lexer.prototype, "nextCharacter", {
        get: function () {
            return this.input[this.readPosition];
        },
        enumerable: true,
        configurable: true
    });
    Lexer.prototype.isSpace = function (character) {
        return (character === " " ||
            character === "\t");
    };
    Lexer.prototype.isNewLine = function (character) {
        return character === "\n";
    };
    Lexer.prototype.isEOF = function (character) {
        return character === "EOF";
    };
    Lexer.prototype.skipSpace = function () {
        while (this.isSpace(this.ch)) {
            this.readChar();
            if (this.isEOF(this.ch)) {
                break;
            }
        }
    };
    Lexer.prototype.expectPeek = function (character) {
        return this.nextCharacter === character;
    };
    Lexer.prototype.readChar = function () {
        if (this.readPosition >= this.input.length) {
            this.ch = "EOF";
        }
        else {
            this.ch = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
    };
    Lexer.prototype.readString = function () {
        var position = this.position;
        while (!this.isSpace(this.nextCharacter) &&
            !this.isNewLine(this.nextCharacter)) {
            this.readChar();
            if (this.isEOF(this.ch)) {
                break;
            }
        }
        return this.input.substring(position, this.readPosition);
    };
    return Lexer;
}());
exports.Lexer = Lexer;
//# sourceMappingURL=Lexer.js.map
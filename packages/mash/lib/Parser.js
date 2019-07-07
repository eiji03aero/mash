"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("./Token");
var A = __importStar(require("./Ast"));
var Parser = /** @class */ (function () {
    function Parser(lexer) {
        this.lexer = lexer;
        // Need to set both curToken and peekToken before get started
        // Be mindful of the fact that here its taking advantage of
        // the internal state of lexer.
        this.curToken = this.lexer.nextToken();
        this.peekToken = this.lexer.nextToken();
    }
    Parser.prototype.parseProgram = function () {
        var program = new A.Program();
        while (!this.curTokenIs(Token_1.Tokens.EOF)) {
            var statement = this.parseStatement();
            if (statement !== null) {
                program.append(statement);
            }
            this.nextToken();
        }
        return program;
    };
    Parser.prototype.parseStatement = function () {
        switch (this.curToken.type) {
            case Token_1.Tokens.NEWLINE:
                return null;
            default:
                return this.parseCommandLine();
        }
    };
    Parser.prototype.parseCommandLine = function () {
        var tokens = [];
        while (!this.curTokenIs(Token_1.Tokens.EOF) && !this.curTokenIs(Token_1.Tokens.NEWLINE)) {
            tokens.push(this.curToken);
            this.nextToken();
        }
        return new A.CommandLine({ tokens: tokens });
    };
    Parser.prototype.nextToken = function () {
        this.curToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    };
    Parser.prototype.curTokenIs = function (type) {
        return type === this.curToken.type;
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AstNode = /** @class */ (function () {
    function AstNode() {
    }
    return AstNode;
}());
exports.AstNode = AstNode;
var Program = /** @class */ (function (_super) {
    __extends(Program, _super);
    function Program() {
        var _this = _super.call(this) || this;
        _this.statements = [];
        return _this;
    }
    Program.prototype.append = function (node) {
        this.statements.push(node);
    };
    Program.prototype.tokenLiteral = function () {
        return this.statements.toString();
    };
    Program.prototype.toString = function () {
        return this.statements.toString();
    };
    return Program;
}(AstNode));
exports.Program = Program;
var CommandLine = /** @class */ (function (_super) {
    __extends(CommandLine, _super);
    function CommandLine(option) {
        var _this = _super.call(this) || this;
        _this.command = option.tokens[0];
        _this.args = option.tokens.slice(1);
        return _this;
    }
    CommandLine.prototype.tokenLiteral = function () {
        return this.command.literal;
    };
    CommandLine.prototype.toString = function () {
        return [
            this.command.literal
        ].concat(this.args.map(function (t) { return t.literal; })).join(', ');
    };
    return CommandLine;
}(AstNode));
exports.CommandLine = CommandLine;
//# sourceMappingURL=Ast.js.map
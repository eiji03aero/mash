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
    function AstNode(token) {
        this.token = token;
    }
    AstNode.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    AstNode.prototype.toString = function () {
        return this.token.literal;
    };
    return AstNode;
}());
exports.AstNode = AstNode;
var AstProgram = /** @class */ (function (_super) {
    __extends(AstProgram, _super);
    function AstProgram(token) {
        var _this = _super.call(this, token) || this;
        _this.nodes = [];
        return _this;
    }
    AstProgram.prototype.append = function (node) {
        this.nodes.push(node);
    };
    AstProgram.prototype.tokenLiteral = function () {
        return this.nodes.toString();
    };
    AstProgram.prototype.toString = function () {
        return this.nodes.toString();
    };
    return AstProgram;
}(AstNode));
exports.AstProgram = AstProgram;
var AstCommandLine = /** @class */ (function (_super) {
    __extends(AstCommandLine, _super);
    function AstCommandLine(token, args) {
        var _this = _super.call(this, token) || this;
        _this.args = args;
        return _this;
    }
    AstCommandLine.prototype.toString = function () {
        return this.args.map(function (t) { return t.toString(); }).join(", ");
    };
    return AstCommandLine;
}(AstNode));
exports.AstCommandLine = AstCommandLine;
var AstString = /** @class */ (function (_super) {
    __extends(AstString, _super);
    function AstString(token) {
        var _this = _super.call(this, token) || this;
        _this.value = token.literal;
        return _this;
    }
    return AstString;
}(AstNode));
exports.AstString = AstString;
//# sourceMappingURL=Ast.js.map
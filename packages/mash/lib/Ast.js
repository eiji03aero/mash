"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Program = /** @class */ (function () {
    function Program() {
        this.nodes = [];
    }
    Program.prototype.append = function (node) {
        this.nodes.push(node);
    };
    Program.prototype.tokenLiteral = function () {
        return this.nodes.toString();
    };
    Program.prototype.toString = function () {
        return this.nodes.toString();
    };
    return Program;
}());
exports.Program = Program;
var CommandLine = /** @class */ (function () {
    function CommandLine(option) {
        this.args = option.tokens;
    }
    CommandLine.prototype.tokenLiteral = function () {
        return this.args[0].literal;
    };
    CommandLine.prototype.toString = function () {
        return this.args.map(function (t) { return t.literal; }).join(', ');
    };
    return CommandLine;
}());
exports.CommandLine = CommandLine;
//# sourceMappingURL=Ast.js.map
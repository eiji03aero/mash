"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ast_1 = require("./Ast");
// import { Environment } from "./Environment";
var Evaluator = /** @class */ (function () {
    function Evaluator() {
    }
    Evaluator.prototype.eval = function (node, env) {
        // Have to make use of constructor instead of interface,
        // since switch-case based on implement-interface is currently not supported
        switch (node.constructor) {
            case Ast_1.Program:
                return this._evalProgram(node, env);
        }
    };
    Evaluator.prototype._evalProgram = function (program, env) {
        var result;
        for (var _i = 0, _a = program.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            result = this.eval(node, env);
        }
        return result;
    };
    return Evaluator;
}());
exports.Evaluator = Evaluator;
//# sourceMappingURL=Evaluator.js.map
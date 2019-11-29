"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var Ast_1 = require("./Ast");
var builtins_1 = require("./builtins");
var Evaluator = /** @class */ (function () {
    function Evaluator(fs, env) {
        this._environment = env;
        this._fileSystem = fs;
    }
    Evaluator.prototype.eval = function (node) {
        // Have to make use of constructor instead of interface,
        // since switch-case based on implement-interface is currently not supported
        switch (node.constructor) {
            case Ast_1.AstProgram:
                return this._evalProgram(node);
            case Ast_1.AstCommandLine:
                return this._evalCommandLine(node);
        }
    };
    Evaluator.prototype._evalProgram = function (program) {
        for (var _i = 0, _a = program.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            this.eval(node);
            if (this._environment.exitStatus !== types_1.ExitStatus.Success) {
                break;
            }
        }
    };
    Evaluator.prototype._evalCommandLine = function (commandLine) {
        var command = commandLine.args[0].tokenLiteral();
        var func = builtins_1.builtins[command];
        if (typeof func !== "function") {
            this._environment.error(1, "command not found: " + command);
            return;
        }
        func({
            args: commandLine.args,
            fileSystem: this._fileSystem,
            environment: this._environment
        });
    };
    return Evaluator;
}());
exports.Evaluator = Evaluator;
//# sourceMappingURL=Evaluator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Evaluator_1 = require("./Evaluator");
var Lexer_1 = require("./Lexer");
var Parser_1 = require("./Parser");
var types_1 = require("./types");
var Environment = /** @class */ (function () {
    function Environment(_fileSystem) {
        this._fileSystem = _fileSystem;
        this._exitStatus = types_1.ExitStatus.Success;
        this._environmentWriteHandler = function (_a) { };
    }
    Object.defineProperty(Environment, "instance", {
        get: function () {
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Environment.prototype, "exitStatus", {
        get: function () {
            return this._exitStatus;
        },
        enumerable: true,
        configurable: true
    });
    Environment.bootstrap = function (fs) {
        this._instance = new this(fs);
        return this._instance;
    };
    Environment.prototype.eval = function (str) {
        this._resetEnvironment();
        var lexer = new Lexer_1.Lexer(str);
        var parser = new Parser_1.Parser(lexer);
        var program = parser.parseProgram();
        var evaluator = new Evaluator_1.Evaluator(this._fileSystem, this);
        evaluator.eval(program);
    };
    Environment.prototype.error = function (code, message) {
        if (message) {
            var msg = "mash " + message;
            this._environmentWriteHandler(msg);
        }
        this._exitStatus = code;
    };
    Environment.prototype.writeln = function (str) {
        this._environmentWriteHandler(str);
    };
    Environment.prototype.onWrite = function (func) {
        this._environmentWriteHandler = func;
    };
    Environment.prototype._resetEnvironment = function () {
        this._exitStatus = types_1.ExitStatus.Success;
    };
    return Environment;
}());
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map
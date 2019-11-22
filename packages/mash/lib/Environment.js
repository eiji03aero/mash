"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Environment = /** @class */ (function () {
    function Environment() {
        this._store = {};
    }
    Environment.prototype.get = function (name) {
        return this._store[name];
    };
    Environment.prototype.set = function (name, value) {
        this._store[name] = value;
    };
    return Environment;
}());
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map
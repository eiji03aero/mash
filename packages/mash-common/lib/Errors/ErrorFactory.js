"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Standard_1 = require("./Standard");
var NoSuchFileOrDirectory_1 = require("./NoSuchFileOrDirectory");
var NotDirectory_1 = require("./NotDirectory");
var Script_1 = require("./Script");
var ErrorFactory = /** @class */ (function () {
    function ErrorFactory() {
    }
    ErrorFactory.standard = function (msg) {
        return new Standard_1.Standard({ msg: msg });
    };
    ErrorFactory.noSuchFileOrDirectory = function (path) {
        return new NoSuchFileOrDirectory_1.NoSuchFileOrDirectory({ path: path });
    };
    ErrorFactory.notDirectory = function (name) {
        return new NotDirectory_1.NotDirectory({ name: name });
    };
    ErrorFactory.script = function (fileName, errorMessage) {
        return new Script_1.Script({ fileName: fileName, errorMessage: errorMessage });
    };
    return ErrorFactory;
}());
exports.ErrorFactory = ErrorFactory;
//# sourceMappingURL=ErrorFactory.js.map
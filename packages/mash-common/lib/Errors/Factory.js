"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoSuchFileOrDirectory_1 = require("./NoSuchFileOrDirectory");
var NotDirectory_1 = require("./NotDirectory");
var Script_1 = require("./Script");
var Standard_1 = require("./Standard");
var Factory = /** @class */ (function () {
    function Factory() {
    }
    Factory.standard = function (msg) {
        return new Standard_1.Standard({ msg: msg });
    };
    Factory.noSuchFileOrDirectory = function (path) {
        return new NoSuchFileOrDirectory_1.NoSuchFileOrDirectory({ path: path });
    };
    Factory.notDirectory = function (name) {
        return new NotDirectory_1.NotDirectory({ name: name });
    };
    Factory.script = function (fileName, errorMessage) {
        return new Script_1.Script({ fileName: fileName, errorMessage: errorMessage });
    };
    return Factory;
}());
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map
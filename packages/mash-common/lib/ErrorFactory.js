"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Errors = __importStar(require("./Errors"));
var ErrorFactory = /** @class */ (function () {
    function ErrorFactory() {
    }
    ErrorFactory.noSuchFileOrDirectory = function (path) {
        return new Errors.NoSuchFileOrDirectory({ path: path });
    };
    ErrorFactory.notDirectory = function (name) {
        return new Errors.NotDirectory({ name: name });
    };
    ErrorFactory.script = function (fileName, errorMessage) {
        return new Errors.Script({ fileName: fileName, errorMessage: errorMessage });
    };
    return ErrorFactory;
}());
exports.ErrorFactory = ErrorFactory;
//# sourceMappingURL=ErrorFactory.js.map
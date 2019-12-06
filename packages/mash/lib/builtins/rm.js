"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __importStar(require("../utils"));
exports.default = (function (_a) {
    var _args = _a.args, fileSystem = _a.fileSystem, environment = _a.environment;
    var _b = utils.parseCommandArgs(_args, {
        r: false
    }), args = _b.args, options = _b.options;
    if (args.length < 2) {
        environment.error(1, 'needs 1 argument. usage required here');
        return;
    }
    var path = args[1];
    var error = fileSystem.deleteNodeFromPath(path, {
        recursive: options.r
    }).error;
    if (error) {
        console.log(error.message());
        environment.error(1, error.message());
    }
});
//# sourceMappingURL=rm.js.map
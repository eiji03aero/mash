"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_common_1 = require("mash-common");
exports.default = (function (_a) {
    var args = _a.args, environment = _a.environment, fileSystem = _a.fileSystem;
    if (args.length < 2) {
        environment.error(1, 'needs 1 argument. usage required here');
        return;
    }
    var pathName = args[1];
    var error = fileSystem.createDirectory({
        path: mash_common_1.paths.dirname(pathName),
        params: { name: mash_common_1.paths.basename(pathName) }
    }).error;
    if (error) {
        environment.error(1, error.message());
    }
});
//# sourceMappingURL=mkdir.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var args = _a.args, environment = _a.environment, fileSystem = _a.fileSystem;
    if (args.length < 2) {
        environment.error(1, "needs 1 argument. usage required here");
        return;
    }
    var path = args[1];
    var result = fileSystem.createDirectory(path);
    if (result.isError) {
        environment.error(1, result.error.message());
    }
});
//# sourceMappingURL=mkdir.js.map
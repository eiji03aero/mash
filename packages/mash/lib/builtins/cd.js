"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var args = _a.args, fileSystem = _a.fileSystem, environment = _a.environment;
    if (args.length < 2) {
        environment.error(1, "needs 1 argument. usage required here");
        return;
    }
    var path = args[1];
    var result = fileSystem.changeCurrentDirectory(path);
    if (result.isError) {
        environment.error(1, result.error.message());
    }
});
//# sourceMappingURL=cd.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var args = _a.args, fileSystem = _a.fileSystem, environment = _a.environment;
    if (args.length < 2) {
        environment.error(1, 'needs 1 argument. usage required here');
        return;
    }
    var path = args[1].tokenLiteral();
    var error = fileSystem.changeCurrentDirectory({ path: path }).error;
    if (error) {
        environment.error(1, error.message());
    }
});
//# sourceMappingURL=cd.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var fileSystem = _a.fileSystem, environment = _a.environment;
    var currentDirectory = fileSystem.currentDirectory;
    var path = fileSystem.resolveAbsolutePath(currentDirectory);
    environment.writeln([
        { text: path },
    ]);
});
//# sourceMappingURL=pwd.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_filesystem_1 = require("mash-filesystem");
exports.default = (function (_a) {
    var args = _a.args, fileSystem = _a.fileSystem, environment = _a.environment;
    if (args.length < 2) {
        environment.error(1, "needs 1 argument. usage required here");
        return;
    }
    var path = args[1];
    var result = fileSystem.resolveNodeFromPath(path);
    if (result.isError) {
        environment.error(1, result.error.message());
        return;
    }
    var node = result.value;
    if (mash_filesystem_1.utils.isDirectory(node)) {
        environment.error(1, node.name + ": is a directory");
        return;
    }
    else if (mash_filesystem_1.utils.isFile(node)) {
        environment.writeln(node.content);
    }
});
//# sourceMappingURL=cat.js.map
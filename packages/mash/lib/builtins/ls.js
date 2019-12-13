"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_filesystem_1 = require("mash-filesystem");
exports.default = (function (_a) {
    var args = _a.args, environment = _a.environment, fileSystem = _a.fileSystem;
    var path = args[1] || ".";
    var result = fileSystem.resolveNodeFromPath(path);
    if (result.isError) {
        environment.error(1, result.error.message());
        return;
    }
    if (mash_filesystem_1.utils.isDirectory(result.value)) {
        var text = result.value.children
            .map(function (c) { return c.name; })
            .join(" ");
        environment.writeln(text);
    }
    else {
        environment.writeln(result.value.name);
    }
});
//# sourceMappingURL=ls.js.map
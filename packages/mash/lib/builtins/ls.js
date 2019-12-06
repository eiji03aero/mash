"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (_a) {
    var args = _a.args, environment = _a.environment, fileSystem = _a.fileSystem;
    var path = args[1] || '.';
    var _b = fileSystem.resolveNodeFromPath(path), error = _b.error, node = _b.node;
    if (error) {
        environment.error(1, error.message());
        return;
    }
    if (node.isDirectory) {
        var text = node.children
            .map(function (c) { return c.name; })
            .join(' ');
        environment.writeln([{ text: text }]);
    }
    else {
        environment.writeln([
            { text: node.name }
        ]);
    }
});
//# sourceMappingURL=ls.js.map
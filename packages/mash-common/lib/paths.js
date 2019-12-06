"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basename = function (path) {
    var split = path.split('/');
    return split[split.length - 1];
};
exports.dirname = function (path) {
    // when path does not contain slash, aka invalid
    if (path.indexOf('/') === -1) {
        return '.';
    }
    var split = path.split('/');
    return split.slice(0, split.length - 1).join('/');
};
exports.inspect = function (path) {
    return {
        basename: exports.basename(path),
        dirname: exports.dirname(path),
    };
};
//# sourceMappingURL=paths.js.map
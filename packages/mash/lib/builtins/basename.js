"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_common_1 = require("mash-common");
exports.default = (function (_a) {
    var args = _a.args, environment = _a.environment;
    if (args.length < 2) {
        environment.error(1, "needs 1 argument. usage required here");
        return;
    }
    var basename = mash_common_1.paths.basename(args[1]);
    environment.writeln(basename);
});
//# sourceMappingURL=basename.js.map
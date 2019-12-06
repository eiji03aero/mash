"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommandArgs = function (args, defaultOptions) {
    var result = { args: [], options: defaultOptions };
    return args.reduce(function (accum, cur) {
        if (cur[0] === '-' && cur.length === 2) {
            accum.options[cur[1]] = true;
        }
        else {
            accum.args.push(cur);
        }
        return accum;
    }, result);
};
//# sourceMappingURL=utils.js.map
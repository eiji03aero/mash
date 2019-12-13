"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var types_1 = require("./types");
exports.hideToken = "\\[";
exports.colorSequenceToken = "\\e[";
exports.colorSequenceCodeRegExp = /\\e\[(.+)m/;
exports.stripHideCharacterRegExp = /\\\[.*\\\[/g;
exports.hideCharacters = function (str) {
    return exports.hideToken + str + exports.hideToken;
};
exports.stripHideCharacters = function (str) {
    return lodash_1.default.chain(str)
        .split(exports.hideToken)
        .filter(function (_, idx) {
        return idx % 2 === 0;
    })
        .join("")
        .value();
};
exports.colorSequence = lodash_1.default.mapValues(types_1.colorNameMap, function (c) {
    return exports.hideCharacters("" + exports.colorSequenceToken + c + "m");
});
exports.getColorFromCode = function (code) {
    var name = types_1.colorCodeMap[code];
    return !!name
        ? name
        : "reset";
};
exports.parseColorString = function (str) {
    var result = lodash_1.default.chain(str)
        // split the string with hideToken => [text, sequence, text, sequence ...]
        .split(exports.hideToken)
        // deal with the first pair => [sequence, text, sequence, text ...]
        .thru(function (t) {
        // if first element is empty, the string is starting with sequence, so pop the first
        // if not, make up sequence for the first
        return t[0] === ""
            ? t.slice(1)
            : [""].concat(t);
    })
        // chunk every two => [[sequence, text], [sequence, text] ...]
        .chunk(2)
        // turn the array into Row => Row
        .map(function (t) {
        var sequence = t[0];
        var text = t[1] || "";
        var numMatch = sequence.match(exports.colorSequenceCodeRegExp);
        var num = !!numMatch && typeof numMatch[1] === "string"
            ? numMatch[1]
            : types_1.colorNameMap.reset;
        var color = exports.getColorFromCode(num);
        return { text: text, color: color };
    })
        .value();
    return result;
};
//# sourceMappingURL=text.js.map
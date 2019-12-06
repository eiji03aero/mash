"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Directory_1 = require("./Directory");
var File_1 = require("./File");
exports.isDirectory = function (node) {
    return node instanceof Directory_1.Directory;
};
exports.isFile = function (node) {
    return node instanceof File_1.File;
};
//# sourceMappingURL=utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_common_1 = require("mash-common");
var FileSystemNode = /** @class */ (function () {
    function FileSystemNode(params) {
        this.cid = mash_common_1.cid.generate();
        this.name = params.name || '';
        this.parentNode = params.parentNode;
        this.createdAt = mash_common_1.date.getCurrentTime();
        this.updatedAt = mash_common_1.date.getCurrentTime();
    }
    Object.defineProperty(FileSystemNode.prototype, "isFile", {
        get: function () {
            return this.constructor.name === 'File';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileSystemNode.prototype, "isDirectory", {
        get: function () {
            return this.constructor.name === 'Directory';
        },
        enumerable: true,
        configurable: true
    });
    FileSystemNode.prototype.update = function (args) {
        args.name && (this.name = args.name);
        args.parentNode && (this.parentNode = args.parentNode);
        this.updatedAt = mash_common_1.date.getCurrentTime();
    };
    FileSystemNode.prototype.setParentNode = function (node) {
        this.parentNode = node;
    };
    return FileSystemNode;
}());
exports.FileSystemNode = FileSystemNode;
//# sourceMappingURL=FileSystemNode.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_common_1 = require("mash-common");
var FileSystemNode = /** @class */ (function () {
    function FileSystemNode(params) {
        this.cid = mash_common_1.cid.generate();
        this.name = params.name || "";
        this.createdAt = mash_common_1.date.getCurrentTime();
        this.updatedAt = mash_common_1.date.getCurrentTime();
        this._parentNode = null;
    }
    Object.defineProperty(FileSystemNode.prototype, "parentNode", {
        get: function () {
            if (!this._parentNode) {
                throw mash_common_1.Errors.Factory.standard("parentNode does not exist for " + this.name);
            }
            return this._parentNode;
        },
        set: function (dir) {
            this._parentNode = dir;
        },
        enumerable: true,
        configurable: true
    });
    FileSystemNode.prototype.update = function (args) {
        if (args.name)
            this.name = args.name;
        this.updatedAt = mash_common_1.date.getCurrentTime();
    };
    return FileSystemNode;
}());
exports.FileSystemNode = FileSystemNode;
//# sourceMappingURL=FileSystemNode.js.map
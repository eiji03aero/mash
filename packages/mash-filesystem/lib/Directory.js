"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystemNode_1 = require("./FileSystemNode");
var Directory = /** @class */ (function (_super) {
    __extends(Directory, _super);
    function Directory(params) {
        var _this = _super.call(this, params) || this;
        _this.children = [];
        _this._root = params.root || false;
        if (params.children) {
            for (var _i = 0, _a = params.children; _i < _a.length; _i++) {
                var child = _a[_i];
                _this.addChild(child);
            }
        }
        return _this;
    }
    Directory.isBasis = function (obj) {
        return "children" in obj;
    };
    Directory.prototype.update = function (args) {
        _super.prototype.update.call(this, args);
    };
    Directory.prototype.addChild = function (node) {
        node.parentNode = this;
        this.children.push(node);
    };
    Directory.prototype.removeChild = function (node) {
        this.children = this.children.filter(function (c) { return c.cid !== node.cid; });
    };
    Directory.prototype.containsByName = function (name) {
        return this.children
            .map(function (node) { return node.name; })
            .includes(name);
    };
    Directory.prototype.findByName = function (name) {
        return this.children.find(function (node) { return node.name === name; });
    };
    Directory.prototype.isRoot = function () {
        return this._root;
    };
    return Directory;
}(FileSystemNode_1.FileSystemNode));
exports.Directory = Directory;
//# sourceMappingURL=Directory.js.map
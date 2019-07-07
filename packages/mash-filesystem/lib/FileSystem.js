"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_common_1 = require("mash-common");
var FileSystemNode_1 = require("./FileSystemNode");
var Directory_1 = require("./Directory");
var File_1 = require("./File");
var initialFileNodes_1 = require("./assets/initialFileNodes");
var FileSystem = /** @class */ (function () {
    function FileSystem() {
        this.root = new Directory_1.Directory({
            name: 'root',
            children: initialFileNodes_1.initialFileNodes,
            __root__: true
        });
        this.currentDirectory = initialFileNodes_1.homeDirectory;
    }
    FileSystem.bootstrap = function () {
        this._instance = new FileSystem();
        return this._instance;
    };
    Object.defineProperty(FileSystem, "instance", {
        get: function () {
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    FileSystem.reboot = function () {
        delete this._instance;
        this.bootstrap();
        return this._instance;
    };
    FileSystem.prototype.changeCurrentDirectory = function (args) {
        var path = args.path;
        var _a = this.resolveNodeFromPath(path), error = _a.error, node = _a.node;
        if (error)
            return { error: error };
        if (!node || !node.isDirectory)
            return { error: mash_common_1.ErrorFactory.notDirectory(path) };
        this.currentDirectory = node;
        return {};
    };
    FileSystem.prototype.createNode = function (args) {
        var path = args.path, params = args.params;
        var _a = this.resolveNodeFromPath(path), error = _a.error, parentDirectory = _a.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory)
            return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
        var node = File_1.File.isBasis(params)
            ? new File_1.File(params)
            : new Directory_1.Directory(params);
        parentDirectory.addChild(node);
        return { node: node };
    };
    FileSystem.prototype.updateNode = function (args) {
        var path = args.path, params = args.params;
        var _a = this.splitLastFragmentFromPath(path), parentPath = _a.parentPath, lastFragment = _a.lastFragment;
        var _b = this.resolveNodeFromPath(parentPath), error = _b.error, parentDirectory = _b.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory) {
            return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
        }
        if (!parentDirectory.containsByName(lastFragment)) {
            return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
        }
        var node = parentDirectory.findByName(lastFragment);
        node.update(params);
        return { node: node };
    };
    FileSystem.prototype.deleteNode = function (args) {
        var path = args.path;
        var _a = this.splitLastFragmentFromPath(path), parentPath = _a.parentPath, lastFragment = _a.lastFragment;
        var _b = this.resolveNodeFromPath(parentPath), error = _b.error, parentDirectory = _b.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory) {
            return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
        }
        if (!parentDirectory.containsByName(lastFragment)) {
            return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
        }
        var node = parentDirectory.findByName(lastFragment);
        parentDirectory.removeChild(node);
        return { node: node };
    };
    FileSystem.prototype.splitLastFragmentFromPath = function (path) {
        var lastIndex = path[path.length - 1] === '/'
            ? path.lastIndexOf('/', path.length - 2)
            : path.lastIndexOf('/');
        return {
            parentPath: lastIndex === -1
                ? '.'
                : path.slice(0, lastIndex),
            lastFragment: path.slice(lastIndex + 1),
        };
    };
    // private isRoot (node: FileSystemNode): boolean {
    //   return node === this.root;
    // }
    FileSystem.prototype.resolveNodeFromPath = function (path) {
        var isAbsolutePath = path[0] === '/';
        var resolvedNode;
        var fragments;
        if (isAbsolutePath) {
            resolvedNode = this.root;
            fragments = path.substring(1).split('/');
        }
        else {
            resolvedNode = this.currentDirectory;
            fragments = path.split('/');
        }
        for (var _i = 0, fragments_1 = fragments; _i < fragments_1.length; _i++) {
            var fragment = fragments_1[_i];
            if (fragment === '..') {
                if (resolvedNode.parentNode instanceof FileSystemNode_1.FileSystemNode) {
                    resolvedNode = resolvedNode.parentNode;
                    continue;
                }
                else {
                    return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
                }
            }
            else if (fragment === '.') {
                continue;
            }
            else if (fragment === '') {
                return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
            }
            else {
                if (!resolvedNode.isDirectory) {
                    return { error: mash_common_1.ErrorFactory.notDirectory(fragment) };
                }
                if (!resolvedNode.containsByName(fragment)) {
                    return { error: mash_common_1.ErrorFactory.noSuchFileOrDirectory(path) };
                }
                resolvedNode = resolvedNode.findByName(fragment);
                continue;
            }
        }
        return { node: resolvedNode };
    };
    return FileSystem;
}());
exports.FileSystem = FileSystem;
//# sourceMappingURL=FileSystem.js.map
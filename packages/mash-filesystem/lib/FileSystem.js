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
        var _a = this._resolveNodeFromPath(path), error = _a.error, node = _a.node;
        if (error)
            return { error: error };
        if (!node || !node.isDirectory)
            return { error: mash_common_1.Errors.Factory.notDirectory(path) };
        this.currentDirectory = node;
        return {};
    };
    FileSystem.prototype.resolveAbsolutePath = function (node) {
        var currentNode = node;
        var nodeNames = [node.name];
        while (!this._isRootDirectory(currentNode.parentNode)) {
            currentNode = currentNode.parentNode;
            nodeNames.unshift(currentNode.name);
        }
        return "/" + nodeNames.join('/');
    };
    FileSystem.prototype.createFile = function (args) {
        var path = args.path, params = args.params;
        var _a = this._resolveNodeFromPath(path), error = _a.error, parentDirectory = _a.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory)
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        var node = new File_1.File(params);
        parentDirectory.addChild(node);
        return { node: node };
    };
    FileSystem.prototype.updateFile = function (args) {
        var path = args.path, params = args.params;
        var _a = this._splitLastFragmentFromPath(path), parentPath = _a.parentPath, lastFragment = _a.lastFragment;
        var _b = this._resolveNodeFromPath(parentPath), error = _b.error, parentDirectory = _b.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        if (!parentDirectory.containsByName(lastFragment)) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        var node = parentDirectory.findByName(lastFragment);
        node.update(params);
        return { node: node };
    };
    FileSystem.prototype.deleteFile = function (args) {
        var path = args.path;
        var _a = this._splitLastFragmentFromPath(path), parentPath = _a.parentPath, lastFragment = _a.lastFragment;
        var _b = this._resolveNodeFromPath(parentPath), error = _b.error, parentDirectory = _b.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        if (!parentDirectory.containsByName(lastFragment)) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        var node = parentDirectory.findByName(lastFragment);
        parentDirectory.removeChild(node);
        return {};
    };
    FileSystem.prototype.createDirectory = function (args) {
        var path = args.path, params = args.params;
        var _a = this._resolveNodeFromPath(path), error = _a.error, parentDirectory = _a.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory)
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        var node = new Directory_1.Directory(params);
        parentDirectory.addChild(node);
        return { node: node };
    };
    FileSystem.prototype.updateDirectory = function (args) {
        var path = args.path, params = args.params;
        var _a = this._splitLastFragmentFromPath(path), parentPath = _a.parentPath, lastFragment = _a.lastFragment;
        var _b = this._resolveNodeFromPath(parentPath), error = _b.error, parentDirectory = _b.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        if (!parentDirectory.containsByName(lastFragment)) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        var node = parentDirectory.findByName(lastFragment);
        node.update(params);
        return { node: node };
    };
    FileSystem.prototype.deleteDirectory = function (args) {
        var path = args.path;
        var _a = this._splitLastFragmentFromPath(path), parentPath = _a.parentPath, lastFragment = _a.lastFragment;
        var _b = this._resolveNodeFromPath(parentPath), error = _b.error, parentDirectory = _b.node;
        if (error)
            return { error: error };
        if (!parentDirectory || !parentDirectory.isDirectory) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        if (!parentDirectory.containsByName(lastFragment)) {
            return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
        }
        var node = parentDirectory.findByName(lastFragment);
        parentDirectory.removeChild(node);
        return {};
    };
    FileSystem.prototype._splitLastFragmentFromPath = function (path) {
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
    FileSystem.prototype._isRootDirectory = function (node) {
        return node === this.root;
    };
    FileSystem.prototype._resolveNodeFromPath = function (path) {
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
        for (var i = 0; i < fragments.length; i++) {
            var fragment = fragments[i];
            if (fragment === '..') {
                if (resolvedNode.parentNode instanceof FileSystemNode_1.FileSystemNode) {
                    resolvedNode = resolvedNode.parentNode;
                    continue;
                }
                else {
                    return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
                }
            }
            else if (fragment === '.') {
                continue;
            }
            else if (fragment === '') {
                if (i === fragments.length - 1) {
                    break;
                }
                return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
            }
            else {
                if (!resolvedNode.isDirectory) {
                    return { error: mash_common_1.Errors.Factory.notDirectory(fragment) };
                }
                if (!resolvedNode.containsByName(fragment)) {
                    return { error: mash_common_1.Errors.Factory.noSuchFileOrDirectory(path) };
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
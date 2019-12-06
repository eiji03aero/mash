"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mash_common_1 = require("mash-common");
var FileSystemNode_1 = require("./FileSystemNode");
var Directory_1 = require("./Directory");
var File_1 = require("./File");
var utils = __importStar(require("./utils"));
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
    FileSystem.prototype.changeCurrentDirectory = function (path) {
        var result = this.resolveNodeFromPath(path);
        if (result.isError)
            return result;
        if (!(utils.isDirectory(result.value))) {
            return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.notDirectory(result.value.name));
        }
        this.currentDirectory = result.value;
        return mash_common_1.Monad.either.right(null);
    };
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
        for (var i = 0; i < fragments.length; i++) {
            var fragment = fragments[i];
            if (fragment === '..') {
                if (resolvedNode.parentNode instanceof FileSystemNode_1.FileSystemNode) {
                    resolvedNode = resolvedNode.parentNode;
                    continue;
                }
                else {
                    return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.noSuchFileOrDirectory(path));
                }
            }
            else if (fragment === '.') {
                continue;
            }
            else if (fragment === '') {
                if (i === fragments.length - 1) {
                    break;
                }
                return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.noSuchFileOrDirectory(path));
            }
            else {
                if (!(utils.isDirectory(resolvedNode))) {
                    return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.notDirectory(fragment));
                }
                if (!resolvedNode.containsByName(fragment)) {
                    return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.noSuchFileOrDirectory(path));
                }
                resolvedNode = resolvedNode.findByName(fragment);
                continue;
            }
        }
        return mash_common_1.Monad.either.right(resolvedNode);
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
    FileSystem.prototype.createFile = function (path) {
        var result = this._expectValidTargetNodePath(path);
        if (result.isError)
            return result;
        var _a = result.value, basename = _a.basename, parentDirectory = _a.parentDirectory;
        var node = new File_1.File({ name: basename });
        parentDirectory.addChild(node);
        return mash_common_1.Monad.either.right(node);
    };
    FileSystem.prototype.deleteFile = function (path) {
        var result = this._expectValidTargetNodePath(path);
        if (result.isError)
            return result;
        if (!result.value.isBaseExists) {
            return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.noSuchFileOrDirectory(path));
        }
        var _a = result.value, parentDirectory = _a.parentDirectory, basename = _a.basename;
        var node = parentDirectory.findByName(basename);
        parentDirectory.removeChild(node);
        return mash_common_1.Monad.either.right(null);
    };
    FileSystem.prototype.createDirectory = function (path) {
        var result = this._expectValidTargetNodePath(path);
        if (result.isError)
            return result;
        var _a = result.value, basename = _a.basename, parentDirectory = _a.parentDirectory;
        var node = new Directory_1.Directory({ name: basename });
        parentDirectory.addChild(node);
        return mash_common_1.Monad.either.right(node);
    };
    FileSystem.prototype.deleteDirectory = function (path) {
        var result = this._expectValidTargetNodePath(path);
        if (result.isError)
            return result;
        if (!result.value.isBaseExists) {
            return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.noSuchFileOrDirectory(path));
        }
        var _a = result.value, basename = _a.basename, parentDirectory = _a.parentDirectory;
        var node = parentDirectory.findByName(basename);
        parentDirectory.removeChild(node);
        return mash_common_1.Monad.either.right(null);
    };
    FileSystem.prototype.updateNodeName = function (path, name) {
        var result = this.resolveNodeFromPath(path);
        if (result.isError)
            return result;
        result.value.name = name;
        return mash_common_1.Monad.either.right(null);
    };
    FileSystem.prototype._isRootDirectory = function (node) {
        return node === this.root;
    };
    FileSystem.prototype._expectValidTargetNodePath = function (path) {
        var _a = mash_common_1.paths.inspect(path), dirname = _a.dirname, basename = _a.basename;
        var result = this.resolveNodeFromPath(dirname);
        if (result.isError
            || (!result.value || !(utils.isDirectory(result.value)))) {
            return mash_common_1.Monad.either.left(mash_common_1.Errors.Factory.noSuchFileOrDirectory(path));
        }
        var parentDirectory = result.value;
        return mash_common_1.Monad.either.right({
            dirname: dirname,
            basename: basename,
            parentDirectory: parentDirectory,
            isBaseExists: parentDirectory.containsByName(basename)
        });
    };
    return FileSystem;
}());
exports.FileSystem = FileSystem;
//# sourceMappingURL=FileSystem.js.map
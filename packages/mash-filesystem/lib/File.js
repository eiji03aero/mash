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
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    function File(params) {
        var _this = _super.call(this, params) || this;
        _this.content = params.content || '';
        return _this;
    }
    File.isBasis = function (obj) {
        return 'content' in obj;
    };
    File.prototype.update = function (args) {
        _super.prototype.update.call(this, args);
        args.content && (this.content = args.content);
    };
    return File;
}(FileSystemNode_1.FileSystemNode));
exports.File = File;
//# sourceMappingURL=File.js.map
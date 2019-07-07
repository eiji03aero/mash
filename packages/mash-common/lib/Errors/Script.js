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
var Base_1 = require("./Base");
var Script = /** @class */ (function (_super) {
    __extends(Script, _super);
    function Script(params) {
        var _this = _super.call(this) || this;
        _this.fileName = params.fileName;
        _this.errorMessage = params.errorMessage;
        return _this;
    }
    Script.prototype.message = function () {
        return "script error: " + this.fileName + " - " + this.errorMessage;
    };
    return Script;
}(Base_1.Base));
exports.Script = Script;
//# sourceMappingURL=Script.js.map
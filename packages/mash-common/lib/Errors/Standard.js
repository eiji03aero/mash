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
var Standard = /** @class */ (function (_super) {
    __extends(Standard, _super);
    function Standard(params) {
        var _this = _super.call(this) || this;
        _this.msg = params.msg;
        return _this;
    }
    Standard.prototype.message = function () {
        return this.msg;
    };
    return Standard;
}(Base_1.Base));
exports.Standard = Standard;
//# sourceMappingURL=Standard.js.map
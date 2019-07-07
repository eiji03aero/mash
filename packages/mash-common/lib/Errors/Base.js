"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
var Base = /** @class */ (function () {
    function Base() {
        this.createdAt = __1.date.getCurrentTime();
    }
    Base.prototype.message = function () {
        return this.createdAt;
    };
    return Base;
}());
exports.Base = Base;
//# sourceMappingURL=Base.js.map
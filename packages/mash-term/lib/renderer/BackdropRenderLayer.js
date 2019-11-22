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
var BaseRenderLayer_1 = require("./BaseRenderLayer");
var BackdropRenderLayer = /** @class */ (function (_super) {
    __extends(BackdropRenderLayer, _super);
    function BackdropRenderLayer(terminal, zIndex) {
        var _this = _super.call(this, terminal, zIndex) || this;
        _this.render = function (params) {
            _this.ctx.fillStyle = params.config.terminalBg;
            _this.ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
        };
        return _this;
    }
    return BackdropRenderLayer;
}(BaseRenderLayer_1.BaseRenderLayer));
exports.BackdropRenderLayer = BackdropRenderLayer;
//# sourceMappingURL=BackdropRenderLayer.js.map
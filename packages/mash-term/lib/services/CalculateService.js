"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CalculateService = /** @class */ (function () {
    function CalculateService(_terminal) {
        this._terminal = _terminal;
        this._canvas = document.createElement('canvas');
    }
    Object.defineProperty(CalculateService.prototype, "ctx", {
        get: function () {
            return this._canvas.getContext('2d');
        },
        enumerable: true,
        configurable: true
    });
    CalculateService.prototype.measureText = function (text) {
        this.ctx.save();
        this.setTextBaseStyle();
        var metrics = this.ctx.measureText(text);
        this.ctx.restore();
        return metrics;
    };
    CalculateService.prototype.setTextBaseStyle = function () {
        this.ctx.font = this._terminal.config.fontSize + "px " + this._terminal.config.fontFamily;
        this.ctx.textBaseline = 'alphabetic';
    };
    return CalculateService;
}());
exports.CalculateService = CalculateService;
//# sourceMappingURL=CalculateService.js.map
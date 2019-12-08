"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseRenderLayer = /** @class */ (function () {
    function BaseRenderLayer(terminal, zIndex) {
        var _this = this;
        this.resizeCanvas = function () {
            _this.canvas.width = _this.terminal.container.offsetWidth;
            _this.canvas.height = _this.terminal.container.offsetHeight;
        };
        this.terminal = terminal;
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("style", "position: absolute; top: 0; bottom: 0; left: 0; right: 0; z-index: " + zIndex + ";");
        this.terminal.container.appendChild(this.canvas);
        this.resizeCanvas();
    }
    Object.defineProperty(BaseRenderLayer.prototype, "ctx", {
        get: function () {
            return this.canvas.getContext("2d");
        },
        enumerable: true,
        configurable: true
    });
    BaseRenderLayer.prototype.render = function (_) {
        return;
    };
    BaseRenderLayer.prototype.resize = function (params) {
        this.resizeCanvas();
        this.render(params);
    };
    BaseRenderLayer.prototype.clear = function (params) {
        var p = params || { x: 0, y: 0, width: this.canvas.offsetWidth, height: this.canvas.offsetHeight };
        this.ctx.clearRect(p.x, p.y, p.width, p.height);
    };
    BaseRenderLayer.prototype.setTextBaseStyle = function () {
        this.ctx.font = this.terminal.config.fontSize + "px " + this.terminal.config.fontFamily;
        this.ctx.textBaseline = "alphabetic";
    };
    BaseRenderLayer.prototype.setTextColorFromObject = function (t) {
        var config = this.terminal.config;
        if (typeof t.color !== "undefined") {
            this.ctx.fillStyle =
                t.color === "blue" ? config.textBlue :
                    t.color === "yellow" ? config.textBlue :
                        config.textBlue;
        }
        else {
            this.ctx.fillStyle = config.textWhite;
        }
    };
    return BaseRenderLayer;
}());
exports.BaseRenderLayer = BaseRenderLayer;
//# sourceMappingURL=BaseRenderLayer.js.map
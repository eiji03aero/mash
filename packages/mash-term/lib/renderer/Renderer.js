"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackdropRenderLayer_1 = require("./BackdropRenderLayer");
var CursorRenderLayer_1 = require("./CursorRenderLayer");
var TextRenderLayer_1 = require("./TextRenderLayer");
var Renderer = /** @class */ (function () {
    function Renderer(terminal) {
        this.renderLayers = [
            new BackdropRenderLayer_1.BackdropRenderLayer(terminal, 1),
            new TextRenderLayer_1.TextRenderLayer(terminal, 2),
            new CursorRenderLayer_1.CursorRenderLayer(terminal, 3)
        ];
    }
    Renderer.prototype.render = function (params) {
        for (var _i = 0, _a = this.renderLayers; _i < _a.length; _i++) {
            var l = _a[_i];
            l.render(params);
        }
    };
    Renderer.prototype.resize = function (params) {
        for (var _i = 0, _a = this.renderLayers; _i < _a.length; _i++) {
            var l = _a[_i];
            l.resize(params);
        }
    };
    return Renderer;
}());
exports.Renderer = Renderer;
//# sourceMappingURL=Renderer.js.map
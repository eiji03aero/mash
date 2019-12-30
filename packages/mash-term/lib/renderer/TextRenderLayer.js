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
var TextRenderLayer = /** @class */ (function (_super) {
    __extends(TextRenderLayer, _super);
    function TextRenderLayer(terminal, zIndex) {
        return _super.call(this, terminal, zIndex) || this;
    }
    TextRenderLayer.prototype.render = function (params) {
        this.ctx.save();
        this.clear();
        for (var i = 0; i < params.displayedRows.length; i++) {
            this.renderRow(params.displayedRows[i], i, params.config);
        }
        this.ctx.restore();
    };
    TextRenderLayer.prototype.renderRow = function (parsedRow, index, config) {
        var xPosition = config.rowLeftMargin;
        var yPosition = (index + 1) * this.terminal.rowHeight - this.terminal.config.rowBottomMargin;
        this.ctx.save();
        this.setTextBaseStyle();
        this.ctx.fillStyle = config.textWhite;
        for (var _i = 0, _a = parsedRow.row; _i < _a.length; _i++) {
            var t = _a[_i];
            this.setTextColorFromObject(t);
            this.ctx.fillText(t.text, xPosition, yPosition);
            xPosition = xPosition + this.ctx.measureText(t.text).width;
        }
        this.ctx.restore();
    };
    return TextRenderLayer;
}(BaseRenderLayer_1.BaseRenderLayer));
exports.TextRenderLayer = TextRenderLayer;
//# sourceMappingURL=TextRenderLayer.js.map
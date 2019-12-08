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
var CursorRenderLayer = /** @class */ (function (_super) {
    __extends(CursorRenderLayer, _super);
    function CursorRenderLayer(terminal, zIndex) {
        var _this = _super.call(this, terminal, zIndex) || this;
        _this.render = function (_) {
            _this.clear();
            _this._clearIntervals();
            _this._beginBlinkCursor();
        };
        _this._blinkTimeoutIds = [];
        _this._blinkIntervalIds = [];
        _this._isCursorShown = false;
        return _this;
    }
    CursorRenderLayer.prototype._clearIntervals = function () {
        this._blinkTimeoutIds.forEach(window.clearTimeout);
        this._blinkTimeoutIds = [];
        this._blinkIntervalIds.forEach(window.clearInterval);
        this._blinkIntervalIds = [];
    };
    CursorRenderLayer.prototype._beginBlinkCursor = function () {
        var _this = this;
        this._isCursorShown = true;
        this._showBlockCursor();
        var timeoutId = window.setTimeout(function () {
            var intervalId = window.setInterval(function () {
                _this._isCursorShown = !_this._isCursorShown;
                if (_this._isCursorShown) {
                    _this._showBlockCursor();
                }
                else {
                    _this.clear();
                }
            }, _this.terminal.config.cursorIntervalMs);
            _this._blinkIntervalIds.push(intervalId);
        }, this.terminal.config.cursorInitialPauseMs);
        this._blinkTimeoutIds.push(timeoutId);
    };
    CursorRenderLayer.prototype._showBlockCursor = function () {
        this.ctx.save();
        this.setTextBaseStyle();
        this.ctx.fillStyle = this.terminal.config.cursorBg;
        this.ctx.fillRect(this._cursorX, this._cursorY + this.terminal.config.rowTopMargin, this._cursorCharWidth, this._cursorCharHeight + this.terminal.config.rowBottomMargin);
        this.ctx.fillStyle = this.terminal.config.textWhite;
        this.ctx.fillText(this._cursorChar, this._cursorX, this._cursorY + this.terminal.config.rowTopMargin + this.terminal.config.fontSize);
        this.ctx.restore();
    };
    Object.defineProperty(CursorRenderLayer.prototype, "_cursorChar", {
        get: function () {
            var selectionStart = this.terminal.textarea.selectionStart;
            var value = this.terminal.textarea.value;
            var isEmpty = value === "";
            var isAtEnd = selectionStart === value.length;
            return isEmpty || isAtEnd
                ? " "
                : this.terminal.textarea.value.slice(selectionStart, selectionStart + 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorRenderLayer.prototype, "_cursorX", {
        get: function () {
            var _this = this;
            var promptWidth = this.terminal.config.prompt
                .map(function (t) { return _this.ctx.measureText(t.text).width; })
                .reduce(function (accum, cur) { return accum + cur; }, 0);
            var inputLength = this.terminal.textarea.value === ""
                ? 0
                : this.ctx.measureText(this.terminal.textarea.value.slice(0, this.terminal.textarea.selectionStart)).width;
            return this.terminal.config.rowLeftMargin + promptWidth + inputLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorRenderLayer.prototype, "_cursorY", {
        get: function () {
            var index = this.terminal.relativePromptRowPosition;
            var height = this.terminal.rowHeight;
            return index * height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorRenderLayer.prototype, "_cursorCharWidth", {
        get: function () {
            return this.ctx.measureText(this._cursorChar).width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorRenderLayer.prototype, "_cursorCharHeight", {
        get: function () {
            return this.terminal.config.fontSize;
        },
        enumerable: true,
        configurable: true
    });
    return CursorRenderLayer;
}(BaseRenderLayer_1.BaseRenderLayer));
exports.CursorRenderLayer = CursorRenderLayer;
//# sourceMappingURL=CursorRenderLayer.js.map
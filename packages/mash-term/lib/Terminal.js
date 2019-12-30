"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var mash_common_1 = require("mash-common");
var Config_1 = require("./common/Config");
var renderer_1 = require("./renderer");
var services_1 = require("./services");
var Terminal = /** @class */ (function () {
    function Terminal(container, cfg) {
        var _this = this;
        this._onContainerWheel = lodash_1.default.throttle(function (e) {
            var stride = Math.abs(e.deltaY);
            var modifier = stride < 2 ? 0 :
                stride < 8 ? 1 :
                    stride < 24 ? 2 :
                        stride < 48 ? 4 :
                            6;
            var direction = e.deltaY > 0 ? 1 : -1;
            _this.scroll(direction * modifier);
        }, 50);
        this._onDocumentClick = function (e) {
            if (_this.container.contains(e.target)) {
                _this.focus();
            }
            else {
                _this.blur();
            }
        };
        this._onResize = function (_) {
            _this._updateCachedRows();
            _this.renderer.resize(_this._renderPayload);
        };
        this._onKeyPress = function (e) {
            _this._onKeyPressHandler(e);
        };
        this._onKeyUp = function (e) {
            if (!_this._isOnBottom) {
                _this.scrollToBottom();
            }
            var start = performance.now();
            var str = e.target.value;
            var rowStr = _this.config.prompt + str;
            _this.updateRowByIndex(_this.rows.length - 1, rowStr);
            console.log(_this._cachedRows.length, performance.now() - start);
            _this._render();
        };
        var config = cfg || {};
        this.container = container;
        this.textarea = document.createElement("textarea");
        this.textarea.setAttribute("style", "width: 0; height: 0; position: absolute;");
        this.container.appendChild(this.textarea);
        this.config = Config_1.getConfig(config);
        this.rows = [];
        this.rowPosition = 0;
        this.isCursorShown = true;
        this._cachedRows = [];
        this.renderer = new renderer_1.Renderer(this);
        this.calculateService = new services_1.CalculateService(this);
        this._onKeyPressHandler = function (_) { };
        window.addEventListener("resize", this._onResize);
        document.addEventListener("click", this._onDocumentClick);
        this.container.addEventListener("wheel", this._onContainerWheel);
        this.textarea.addEventListener("keyup", this._onKeyUp);
        this.textarea.addEventListener("keypress", this._onKeyPress);
        this.focus();
    }
    Object.defineProperty(Terminal.prototype, "relativePromptRowPosition", {
        get: function () {
            return this._cachedRows.length - 1 - this.rowPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Terminal.prototype, "rowHeight", {
        get: function () {
            return this.config.fontSize + this.config.rowTopMargin + this.config.rowBottomMargin;
        },
        enumerable: true,
        configurable: true
    });
    Terminal.prototype.getWindowStat = function () {
        var width = this.container.offsetWidth;
        var height = this.container.offsetHeight;
        return {
            width: width,
            height: height,
            availableWidth: width - this.config.rowLeftMargin - this.config.rowRightMargin,
            availableHeight: height - this.config.rowTopMargin - this.config.rowBottomMargin,
        };
    };
    Terminal.prototype.measureText = function (str) {
        return this.calculateService.measureText(str);
    };
    Terminal.prototype.focus = function () {
        this.textarea.focus();
    };
    Terminal.prototype.blur = function () {
        this.textarea.blur();
    };
    Terminal.prototype.prompt = function () {
        if (this._isOnBottom) {
            this.rowPosition += 1;
        }
        this.textarea.value = "";
        this.appendRow(this.config.prompt);
        this._render();
    };
    Terminal.prototype.clear = function () {
        this.rowPosition = this._cachedRows.length;
        this._render();
    };
    Terminal.prototype.writeln = function (str) {
        if (this._isOnBottom) {
            this.rowPosition += 1;
        }
        this.appendRow(str);
        this._render();
    };
    Terminal.prototype.appendRow = function (str) {
        this.rows.push(str);
        this._updateCachedRows();
    };
    Terminal.prototype.updateRowByIndex = function (idx, str) {
        this.rows = this.rows.map(function (s, i) {
            return i === idx
                ? str
                : s;
        });
        var cfIdx = lodash_1.default.findIndex(this._cachedRows, function (r) {
            return r.rowIndex === idx;
        });
        var clIdx = lodash_1.default.findLastIndex(this._cachedRows, function (r) {
            return r.rowIndex === idx;
        });
        var former = this._cachedRows.slice(0, cfIdx);
        var latter = this._cachedRows.slice(clIdx + 1, this._cachedRows.length);
        var splitted = this._splitRowWithLimit(str, idx);
        this._cachedRows = __spreadArrays(former, splitted, latter);
    };
    Terminal.prototype.scroll = function (numberToScroll) {
        var nextPosition = this.rowPosition + numberToScroll;
        var shouldBeOnTop = nextPosition < 0;
        var shouldBeOnBottom = nextPosition >= this._cachedRows.length;
        this.rowPosition = (shouldBeOnTop ? 0 :
            shouldBeOnBottom ? this._cachedRows.length - 1 :
                nextPosition);
        this._render();
    };
    Terminal.prototype.scrollToBottom = function () {
        this.rowPosition = this._bottomPosition;
        this._render();
    };
    Terminal.prototype.onKeyPress = function (fn) {
        this._onKeyPressHandler = fn;
    };
    Object.defineProperty(Terminal.prototype, "_renderPayload", {
        get: function () {
            return {
                rows: this._cachedRows,
                displayedRows: this._cachedRows.slice(this.rowPosition, this.rowPosition + this._numberOfDisplayedRows),
                rowPosition: this.rowPosition,
                rowHeight: this.rowHeight,
                numberOfDisplayedRows: this._numberOfDisplayedRows,
                config: this.config,
                textarea: this.textarea,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Terminal.prototype, "_bottomPosition", {
        get: function () {
            var bottomPosition = this.rows.length - this._numberOfDisplayedRows;
            return Math.max(bottomPosition, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Terminal.prototype, "_numberOfDisplayedRows", {
        get: function () {
            return Math.floor(this.container.offsetHeight / this.rowHeight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Terminal.prototype, "_isOnBottom", {
        get: function () {
            if (this.rows.length < this._numberOfDisplayedRows) {
                return false;
            }
            return this.rowPosition === this.rows.length - this._numberOfDisplayedRows;
        },
        enumerable: true,
        configurable: true
    });
    Terminal.prototype._render = function () {
        this.renderer.render(this._renderPayload);
    };
    Terminal.prototype._updateCachedRows = function () {
        var _this = this;
        this._cachedRows = this.rows.reduce(function (accum, cur) {
            var splitRows = _this._splitRowWithLimit(cur, accum.length);
            return accum.concat(splitRows);
        }, []);
    };
    Terminal.prototype._splitRowWithLimit = function (str, idx) {
        var row = mash_common_1.text.parseColorString(str);
        var _a = this.config, rowLeftMargin = _a.rowLeftMargin, rowRightMargin = _a.rowRightMargin;
        var availableWidth = this.container.offsetWidth - rowLeftMargin - rowRightMargin;
        var rs = [];
        var tmpWidth = 0;
        var getNewRow = function () { return ({ rowIndex: idx, row: [] }); };
        rs.push(getNewRow());
        for (var ti = 0; ti < row.length; ti++) {
            var t = row[ti];
            rs[rs.length - 1].row.push(__assign(__assign({}, t), { text: "" }));
            for (var ci = 0; ci < t.text.length; ci++) {
                var c = t.text[ci];
                tmpWidth += this.measureText(c).width;
                if (tmpWidth <= availableWidth) {
                    var lastRow = rs[rs.length - 1];
                    var lastTextObject = lastRow.row[lastRow.row.length - 1];
                    lastTextObject.text += c;
                }
                else {
                    var newRow = getNewRow();
                    var newTextObject = __assign(__assign({}, t), { text: c });
                    newRow.row.push(newTextObject);
                    rs.push(newRow);
                    tmpWidth = 0;
                }
            }
        }
        return rs;
    };
    return Terminal;
}());
exports.Terminal = Terminal;
//# sourceMappingURL=Terminal.js.map
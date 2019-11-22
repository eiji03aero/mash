"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    prompt: [],
    cursorInitialPauseMs: 2000,
    cursorIntervalMs: 500,
    terminalBg: '#182F40',
    cursorBg: '#396FE2',
    textWhite: '#FFFFFF',
    textBlue: '#396FE2',
    textYellow: '#FAED70',
    fontFamily: 'Menlo',
    fontSize: 16,
    rowTopMargin: 4,
    rowBottomMargin: 4,
    rowLeftMargin: 8,
    rowRightMargin: 8
};
exports.getConfig = function (config) {
    return Object.assign({}, exports.defaultConfig, config);
};
//# sourceMappingURL=Config.js.map
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
document.addEventListener('DOMContentLoaded', function (_) {
    var promptObj = [
        { text: "Eiji's MBP " },
        { text: "/home ", color: 'blue' },
        { text: "$ " },
    ];
    var terminal = new index_1.Terminal(document.querySelector('#app'), {
        prompt: promptObj
    });
    var dummy = [
        "this is not going to end well",
        "I know it was not the right timing, but I couldn't help",
        "There was this beautiful sunrise",
        "That was it",
    ];
    var count = 0;
    var _loop_1 = function (t) {
        count += 1;
        var c = count;
        setTimeout(function () {
            terminal.writeln(__spreadArrays(promptObj, [{ text: t }]));
        }, c * 100);
    };
    for (var _i = 0, dummy_1 = dummy; _i < dummy_1.length; _i++) {
        var t = dummy_1[_i];
        _loop_1(t);
    }
    setTimeout(function () {
        terminal.prompt();
    }, dummy.length * 100);
    terminal.onKeyPress(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            terminal.prompt();
        }
    });
});
//# sourceMappingURL=index.dev.js.map
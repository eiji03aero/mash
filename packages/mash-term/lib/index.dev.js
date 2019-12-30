"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mash_common_1 = require("mash-common");
var index_1 = require("./index");
document.addEventListener("DOMContentLoaded", function (_) {
    var promptStr = "Eiji's MBP " + mash_common_1.text.colorSequence.blue + "/home " + mash_common_1.text.colorSequence.reset + "$ ";
    var terminal = new index_1.Terminal(document.querySelector("#app"), {
        prompt: promptStr,
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
            terminal.writeln(promptStr + t);
        }, c * 100);
    };
    for (var _i = 0, dummy_1 = dummy; _i < dummy_1.length; _i++) {
        var t = dummy_1[_i];
        _loop_1(t);
    }
    setTimeout(function () {
        terminal.prompt();
    }, dummy.length * 100);
    window.t = terminal;
    terminal.onKeyPress(function (e) {
        switch (e.key) {
            case "Enter":
                e.preventDefault();
                terminal.prompt();
                break;
        }
    });
});
//# sourceMappingURL=index.dev.js.map
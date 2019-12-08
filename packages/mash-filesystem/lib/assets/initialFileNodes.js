"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Directory_1 = require("../Directory");
var File_1 = require("../File");
exports.homeDirectory = new Directory_1.Directory({
    name: "home",
    children: [
        new Directory_1.Directory({
            name: "Applications",
            children: [
                new File_1.File({
                    name: "game.txt",
                    content: "game is here",
                }),
                new File_1.File({
                    name: "editor.txt",
                    content: "editor will be here",
                }),
            ],
        }),
        new Directory_1.Directory({
            name: "Desktop",
            children: [
                new File_1.File({
                    name: "memo.txt",
                    content: "do some study",
                }),
                new Directory_1.Directory({
                    name: "work",
                    children: [
                        new File_1.File({
                            name: "todos",
                            content: "send an email",
                        }),
                        new File_1.File({
                            name: "stats.excel",
                            content: "name,domo,kore,",
                        }),
                    ],
                }),
            ],
        }),
        new File_1.File({
            name: "README.txt",
            content: "read me here man",
        }),
        new File_1.File({
            name: "todo.txt",
            content: "do it man",
        }),
        new File_1.File({
            name: "site-policy",
            content: "there is no such thing as policy man",
        }),
    ],
});
var varDirectory = new Directory_1.Directory({
    name: "var",
    children: [
        new File_1.File({
            name: "error.log",
            content: "your error is here",
        }),
    ],
});
var etcDirectory = new Directory_1.Directory({
    name: "etc",
    children: [
        new File_1.File({
            name: "null",
            content: "null file is here",
        }),
    ],
});
exports.initialFileNodes = [
    varDirectory,
    exports.homeDirectory,
    etcDirectory,
];
//# sourceMappingURL=initialFileNodes.js.map
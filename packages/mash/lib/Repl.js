"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mash_filesystem_1 = require("mash-filesystem");
var readline_1 = __importDefault(require("readline"));
var Environment_1 = require("./Environment");
/* tslint:disable */
var fileSystem = mash_filesystem_1.FileSystem.bootstrap();
var environment = Environment_1.Environment.bootstrap(fileSystem);
environment.onWrite(function (str) {
    console.log(str);
});
var getPrompt = function () { return "mash " + fileSystem.currentDirectory.name + " > "; };
var rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: getPrompt(),
});
console.log("\nWelcome to mash!\nCtl + C to finish\n");
rl.prompt();
rl.on("line", function (input) {
    environment.eval(input);
    rl.setPrompt(getPrompt());
    rl.prompt();
});
//# sourceMappingURL=Repl.js.map
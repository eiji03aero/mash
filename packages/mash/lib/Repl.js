"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline_1 = __importDefault(require("readline"));
var Lexer_1 = require("./Lexer");
var Parser_1 = require("./Parser");
var prompt = 'mash > ';
var rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: prompt
});
console.log("\nWelcome to mash!\nCtl + C to finish\n");
rl.prompt();
rl.on('line', function (input) {
    var lexer = new Lexer_1.Lexer(input);
    var parser = new Parser_1.Parser(lexer);
    var program = parser.parseProgram();
    var parsed = program.statements
        .map(function (sm) {
        return sm.toString();
    })
        .join('\n');
    console.log("\n  input: " + input + "\n  parsed program: " + parsed + "\n  ");
    rl.setPrompt(prompt);
    rl.prompt();
});
//# sourceMappingURL=Repl.js.map
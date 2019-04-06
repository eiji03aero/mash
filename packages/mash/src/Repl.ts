import readline from 'readline';

import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { AstNode } from "./Ast";

const prompt = 'mash > ';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt
});

console.log(`
Welcome to mash!
Ctl + C to finish
`);

rl.prompt();

rl.on('line', (input: string) => {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  const parsed = program.statements
    .map((sm: AstNode) => {
      return sm.toString();
    })
    .join('\n');

  console.log(`
  input: ${input}
  parsed program: ${parsed}
  `);

  rl.setPrompt(prompt);
  rl.prompt();
});

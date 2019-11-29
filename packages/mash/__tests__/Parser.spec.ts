import {
  IAstNode
} from '../src/types';
import { Lexer } from "../src/Lexer";
// import { Token } from "./Token";
import { Parser } from "../src/Parser";
import * as A from '../src/Ast';

describe('Parser', () => {
  it('should parse CommandLine', () => {
    const tests = [
      {
        input: "echo domo",
        cls: [
          ["echo", "domo"]
        ],
      },
      {
        input: `
        echo domo
        cd ~/
        `,
        cls: [
          ["echo", "domo"],
          ["cd", "~/"],
        ],
      },
    ];

    for (let t of tests) {
      const lexer = new Lexer(t.input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      for (let i = 0; i < t.cls.length; i++) {
        const args = t.cls[i];
        const node = program.nodes[i];
        testCommandLine(args, node);
      }
    }
  });
});

function testCommandLine (
  args: string[],
  node: IAstNode
) {
  if (node instanceof A.AstCommandLine) {
    for (let i = 0; i < args.length; i++) {
      expect(args[i]).toBe(node.args[i].tokenLiteral());
    }
  }
}

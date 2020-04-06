import {
  IToken,
} from "../src/types";
import { Lexer } from "../src/Lexer";
import { tokens } from "../src/Token";

describe("Lexer", () => {
  it ("should lex one line", () => {
    const input = "echo domo";
    const tests = [
      { type: tokens.STRING, literal: "echo" },
      { type: tokens.STRING, literal: "domo" },
      { type: tokens.EOF, literal: "" },
    ];

    const l = new Lexer(input);
    for (const t of tests) {
      const tok: IToken = l.nextToken();
      expect(tok.type).toBe(t.type);
      expect(tok.literal).toBe(t.literal);
    }
  });

  it("should lex basics", () => {
    const input = `
    echo domo

    cd ~/
    mv ./domo ./domo.bak
    echo domo | cd
    && ||
    { } ( ) : ; =
    `;

    const tests = [
      { type: tokens.NEWLINE,       literal: "\n" },

      { type: tokens.STRING,       literal: "echo" },
      { type: tokens.STRING,       literal: "domo" },
      { type: tokens.NEWLINE,       literal: "\n" },

      { type: tokens.NEWLINE,       literal: "\n" },

      { type: tokens.STRING,       literal: "cd" },
      { type: tokens.STRING,       literal: "~/" },
      { type: tokens.NEWLINE,       literal: "\n" },

      { type: tokens.STRING,       literal: "mv" },
      { type: tokens.STRING,       literal: "./domo" },
      { type: tokens.STRING,    literal: "./domo.bak" },
      { type: tokens.NEWLINE,       literal: "\n" },

      { type: tokens.STRING,       literal: "echo" },
      { type: tokens.STRING,       literal: "domo" },
      { type: tokens.PIPE,    literal: "|" },
      { type: tokens.STRING,       literal: "cd" },
      { type: tokens.NEWLINE,       literal: "\n" },

      { type: tokens.AND,       literal: "&&" },
      { type: tokens.OR,       literal: "||" },
      { type: tokens.NEWLINE,       literal: "\n" },

      { type: tokens.LBRACE,    literal: "{" },
      { type: tokens.RBRACE,    literal: "}" },
      { type: tokens.LPAREN,    literal: "(" },
      { type: tokens.RPAREN,    literal: ")" },
      { type: tokens.COLON,     literal: ":" },
      { type: tokens.SEMICOLON, literal: ";" },
      { type: tokens.ASSIGN,    literal: "=" },

      { type: tokens.NEWLINE,       literal: "\n" },
      { type: tokens.EOF, literal: "" },
    ];
    const l = new Lexer(input);

    for (const t of tests) {
      const tok: IToken = l.nextToken();
      expect(tok.type).toBe(t.type);
      expect(tok.literal).toBe(t.literal);
    }
  });
});

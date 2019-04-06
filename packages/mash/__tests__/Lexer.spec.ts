import { Lexer } from "../src/Lexer";
import { Tokens, Token } from "../src/Token";

describe('Lexer', () => {
  it ('should lex one line', () => {
    const input = "echo domo";
    const tests = [
      { type: Tokens.STRING, literal: "echo" },
      { type: Tokens.STRING, literal: "domo" },
      { type: Tokens.EOF, literal: "" },
    ];

    const l = new Lexer(input);
    for (let t of tests) {
      const tok: Token = l.nextToken();
      expect(tok.type).toBe(t.type);
      expect(tok.literal).toBe(t.literal);
    }
  });

  it('should lex basics', () => {
    const input = `
    echo domo

    cd ~/
    mv ./domo ./domo.bak
    echo domo | cd
    && ||
    { } ( ) : ; =
    `;

    const tests = [
      { type: Tokens.NEWLINE,       literal: "\n" },

      { type: Tokens.STRING,       literal: "echo" },
      { type: Tokens.STRING,       literal: "domo" },
      { type: Tokens.NEWLINE,       literal: "\n" },

      { type: Tokens.NEWLINE,       literal: "\n" },

      { type: Tokens.STRING,       literal: "cd" },
      { type: Tokens.STRING,       literal: "~/" },
      { type: Tokens.NEWLINE,       literal: "\n" },

      { type: Tokens.STRING,       literal: "mv" },
      { type: Tokens.STRING,       literal: "./domo" },
      { type: Tokens.STRING,    literal: "./domo.bak" },
      { type: Tokens.NEWLINE,       literal: "\n" },

      { type: Tokens.STRING,       literal: "echo" },
      { type: Tokens.STRING,       literal: "domo" },
      { type: Tokens.PIPE,    literal: "|" },
      { type: Tokens.STRING,       literal: "cd" },
      { type: Tokens.NEWLINE,       literal: "\n" },

      { type: Tokens.AND,       literal: "&&" },
      { type: Tokens.OR,       literal: "||" },
      { type: Tokens.NEWLINE,       literal: "\n" },

      { type: Tokens.LBRACE,    literal: "{" },
      { type: Tokens.RBRACE,    literal: "}" },
      { type: Tokens.LPAREN,    literal: "(" },
      { type: Tokens.RPAREN,    literal: ")" },
      { type: Tokens.COLON,     literal: ":" },
      { type: Tokens.SEMICOLON, literal: ";" },
      { type: Tokens.ASSIGN,    literal: "=" },

      { type: Tokens.NEWLINE,       literal: "\n" },
      { type: Tokens.EOF, literal: "" }
    ]
    const l = new Lexer(input);

    for (let t of tests) {
      const tok: Token = l.nextToken();
      expect(tok.type).toBe(t.type);
      expect(tok.literal).toBe(t.literal);
    }
  });
});

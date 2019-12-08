import { newToken, tokens } from "./Token";
import {
  ILexer,
  IToken,
} from "./types";

export class Lexer implements ILexer {
  public input: string;
  public position: number;
  public readPosition: number;
  public ch: string;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch = "";

    this.readChar();
  }

  public nextToken() {
    const tok: IToken = newToken();

    this.skipSpace();

    switch (this.ch) {
      case "\n":
        tok.type = tokens.NEWLINE;
        tok.literal = "\n";
        break;
      case "=":
        tok.type = tokens.ASSIGN;
        tok.literal = "=";
        break;
      case "$":
        tok.type = tokens.DOLLAR;
        tok.literal = "$";
        break;
      case "{":
        tok.type = tokens.LBRACE;
        tok.literal = "{";
        break;
      case "}":
        tok.type = tokens.RBRACE;
        tok.literal = "}";
        break;
      case "(":
        tok.type = tokens.LPAREN;
        tok.literal = "(";
        break;
      case ")":
        tok.type = tokens.RPAREN;
        tok.literal = ")";
        break;
      case "|":
        if (this.expectPeek("|")) {
          this.readChar();
          tok.type = tokens.OR;
          tok.literal = "||";
        } else {
          tok.type = tokens.PIPE;
          tok.literal = "|";
        }
        break;
      case "&":
        this.readChar();
        tok.type = tokens.AND;
        tok.literal = "&&";
        break;
      case ":":
        tok.type = tokens.COLON;
        tok.literal = ":";
        break;
      case ";":
        tok.type = tokens.SEMICOLON;
        tok.literal = ";";
        break;
      case "EOF":
        tok.type = tokens.EOF;
        break;
      default:
        tok.type = tokens.STRING;
        tok.literal = this.readString();
    }

    this.readChar();
    return tok;
  }

  private get nextCharacter() {
    return this.input[this.readPosition];
  }

  private isSpace(character: string) {
    return (
      character === " " ||
      character === "\t"
    );
  }

  private isNewLine(character: string) {
    return character === "\n";
  }

  private isEOF(character: string) {
    return character === "EOF";
  }

  private skipSpace() {
    while (this.isSpace(this.ch)) {
      this.readChar();
      if (this.isEOF(this.ch)) {
        break;
      }
    }
  }

  private expectPeek(character: string) {
    return this.nextCharacter === character;
  }

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = "EOF";
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private readString() {
    const position = this.position;
    while (
      !this.isSpace(this.nextCharacter) &&
      !this.isNewLine(this.nextCharacter)
    ) {
      this.readChar();
      if (this.isEOF(this.ch)) {
        break;
      }
    }

    return this.input.substring(position, this.readPosition);
  }
}

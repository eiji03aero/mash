import { Token, Tokens, newToken } from "./Token";

export class Lexer {
  input: string;
  position: number;
  readPosition: number;
  ch: string;

  constructor (input: string) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch = "";

    this.readChar();
  }

  nextToken () {
    const tok: Token = newToken();

    this.skipSpace();

    switch (this.ch) {
      case '\n':
        tok.type = Tokens.NEWLINE;
        tok.literal = '\n';
        break;
      case '=':
        tok.type = Tokens.ASSIGN;
        tok.literal = '=';
        break;
      case '$':
        tok.type = Tokens.DOLLAR;
        tok.literal = '$';
        break;
      case '{':
        tok.type = Tokens.LBRACE;
        tok.literal = '{';
        break;
      case '}':
        tok.type = Tokens.RBRACE;
        tok.literal = '}';
        break;
      case '(':
        tok.type = Tokens.LPAREN;
        tok.literal = '(';
        break;
      case ')':
        tok.type = Tokens.RPAREN;
        tok.literal = ')';
        break;
      case '|':
        if (this.expectPeek('|')) {
          this.readChar();
          tok.type = Tokens.OR;
          tok.literal = '||';
        } else {
          tok.type = Tokens.PIPE;
          tok.literal = '|';
        }
        break;
      case '&':
        this.readChar();
        tok.type = Tokens.AND;
        tok.literal = '&&';
        break;
      case ':':
        tok.type = Tokens.COLON;
        tok.literal = ':';
        break;
      case ';':
        tok.type = Tokens.SEMICOLON;
        tok.literal = ';';
        break;
      case 'EOF':
        tok.type = Tokens.EOF;
        break;
      default:
        tok.type = Tokens.STRING;
        tok.literal = this.readString();
    }

    this.readChar();
    return tok;
  }

  private get nextCharacter () {
    return this.input[this.readPosition];
  }

  private isSpace (character: string) {
    return (
      character === ' ' ||
      character === '\t'
    );
  }

  private isNewLine (character: string) {
    return character === '\n';
  }

  private isEOF (character: string) {
    return character === 'EOF';
  }

  private skipSpace () {
    while (this.isSpace(this.ch)) {
      this.readChar();
      if (this.isEOF(this.ch)) {
        break;
      }
    }
  }

  private expectPeek (character: string) {
    return this.nextCharacter === character;
  }

  private readChar () {
    if (this.readPosition >= this.input.length) {
      this.ch = 'EOF';
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private readString () {
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

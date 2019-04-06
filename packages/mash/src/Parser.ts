import { Lexer } from "./Lexer";
import { Token, Tokens } from "./Token";
import * as A from './Ast';

export class Parser {
  lexer: Lexer;
  errors: any;

  curToken: Token;
  peekToken: Token;

  constructor (lexer: Lexer) {
    this.lexer = lexer;

    // Need to set both curToken and peekToken before get started
    // Be mindful of the fact that here its taking advantage of
    // the internal state of lexer.
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram () {
    const program = new A.Program();

    while (!this.curTokenIs(Tokens.EOF)) {
      let statement = this.parseStatement();
      if (statement !== null) {
        program.append(statement);
      }
      this.nextToken();
    }

    return program;
  }

  private parseStatement () {
    switch (this.curToken.type) {
      case Tokens.NEWLINE:
        return null;
      default:
        return this.parseCommandLine();
    }
  }

  private parseCommandLine () {
    const tokens: Token[] = [];
    while (!this.curTokenIs(Tokens.EOF) && !this.curTokenIs(Tokens.NEWLINE)) {
      tokens.push(this.curToken);
      this.nextToken();
    }
    return new A.CommandLine({ tokens });
  }

  private nextToken () {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private curTokenIs (type: string) {
    return type === this.curToken.type;
  }
}

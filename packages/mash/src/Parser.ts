import {
  IParser,
  IToken,
  ILexer
} from './types';
import { Tokens } from "./Token";
import * as A from './Ast';

export class Parser implements IParser {
  public lexer: ILexer;
  public errors: any;

  public curToken: IToken;
  public peekToken: IToken;

  constructor (lexer: ILexer) {
    this.lexer = lexer;

    // Need to set both curToken and peekToken before get started
    // Be mindful of the fact that here its taking advantage of
    // the internal state of lexer.
    this.curToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
  }

  public parseProgram () {
    const program = new A.Program();

    while (!this.curTokenIs(Tokens.EOF)) {
      const node = this.parseNode();
      if (node !== null) {
        program.append(node);
      }
      this.nextToken();
    }

    return program;
  }

  private parseNode () {
    switch (this.curToken.type) {
      case Tokens.NEWLINE:
        return null;
      default:
        return this.parseCommandLine();
    }
  }

  private parseCommandLine () {
    const tokens: IToken[] = [];
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

  private curTokenIs (t: string) {
    return t === this.curToken.type;
  }
}

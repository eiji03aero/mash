import {
  IParser,
  IToken,
  ILexer,
  IAstNode
} from './types';
import { Tokens } from "./Token";
import * as A from './Ast';

// TODO: have to deal with the tokens for program and commandline
const placeholderToken: IToken = {
  type: 'placeholder',
  literal: ''
};

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
    const program = new A.AstProgram(placeholderToken);

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
    const args: IAstNode[] = [];
    while (!this.curTokenIs(Tokens.EOF) && !this.curTokenIs(Tokens.NEWLINE)) {
      args.push(new A.AstString(this.curToken));
      this.nextToken();
    }
    return new A.AstCommandLine(placeholderToken, args);
  }

  private nextToken () {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private curTokenIs (t: string) {
    return t === this.curToken.type;
  }
}

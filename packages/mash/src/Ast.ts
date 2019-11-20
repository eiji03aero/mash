import {
  IToken,
  IAstNode,
  IProgram,
  ICommandLine
} from './Types';

export class Program implements IProgram {
  public nodes: IAstNode[];

  constructor () {
    this.nodes = [] as IAstNode[];
  }

  public append (node: IAstNode) {
    this.nodes.push(node);
  }

  public tokenLiteral () {
    return this.nodes.toString();
  }

  public toString () {
    return this.nodes.toString();
  }
}

export class CommandLine implements ICommandLine {
  public command: IToken;
  public args: IToken[];

  constructor (option: { tokens: IToken[] }) {
    this.command = option.tokens[0];
    this.args = option.tokens.slice(1);
  }

  public tokenLiteral () {
    return this.command.literal;
  }

  public toString () {
    return [
      this.command.literal,
      ...this.args.map(t => t.literal)
    ].join(', ');
  }
}

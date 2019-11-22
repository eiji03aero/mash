import {
  IToken,
  IAstNode,
  IProgram,
  ICommandLine
} from './types';

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
  public args: IToken[];

  constructor (option: { tokens: IToken[] }) {
    this.args = option.tokens;
  }

  public tokenLiteral () {
    return this.args[0].literal;
  }

  public toString () {
    return this.args.map(t => t.literal).join(', ');
  }
}

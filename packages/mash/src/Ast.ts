import { Token } from "./Token";

export abstract class AstNode {
  constructor () {}
  abstract tokenLiteral (): string;
  abstract toString (): string;
}

export type Statement = AstNode | CommandLine;

export class Program extends AstNode {
  statements: Statement[];

  constructor () {
    super();
    this.statements = [] as AstNode[];
  }

  append (node: AstNode) {
    this.statements.push(node);
  }

  tokenLiteral () {
    return this.statements.toString();
  }

  toString () {
    return this.statements.toString();
  }
}

export class CommandLine extends AstNode {
  command: Token;
  args: Token[];

  constructor (option: { tokens: Token[] }) {
    super();
    this.command = option.tokens[0];
    this.args = option.tokens.slice(1);
  }

  tokenLiteral () {
    return this.command.literal;
  }

  toString () {
    return [
      this.command.literal,
      ...this.args.map(t => t.literal)
    ].join(', ');
  }
}

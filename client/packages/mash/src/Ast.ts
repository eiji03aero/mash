import {
  IAstCommandLine,
  IAstNode,
  IAstProgram,
  IAstString,
  IToken,
} from "./types";

export class AstNode implements IAstNode {
  constructor (
    public token: IToken,
  ) { }

  public tokenLiteral (): string {
    return this.token.literal;
  }

  public toString (): string {
    return this.token.literal;
  }
}

export class AstProgram extends AstNode implements IAstProgram {
  public nodes: IAstNode[];

  constructor (token: IToken) {
    super(token);
    this.nodes = [] as IAstNode[];
  }

  public append (node: IAstNode): void {
    this.nodes.push(node);
  }

  public tokenLiteral (): string {
    return this.nodes.toString();
  }

  public toString (): string {
    return this.nodes.toString();
  }
}

export class AstCommandLine extends AstNode implements IAstCommandLine {
  public args: IAstNode[];

  constructor (token: IToken, args: IAstNode[]) {
    super(token);
    this.args = args;
  }

  public toString (): string {
    return this.args.map((t) => t.toString()).join(", ");
  }
}

export class AstString extends AstNode implements IAstString {
  public value: string;

  constructor (token: IToken) {
    super(token);
    this.value = token.literal;
  }
}

import {
  AstNode,
  // Statement,
  Program,
  // CommandLine
} from "./Ast";
import { Env } from "./Env";

export class Evaluator {
  static eval (node: AstNode, env: Env) {
    if (node instanceof Program) {
      return this.evalProgram(node, env);
    }
  }

  static evalProgram (program: Program, env: Env) {
    let result: any;

    for (let statement of program.statements) {
      result = this.eval(statement, env);
    }

    return result;
  }
}

import {
  IAstNode,
  IEvaluator
} from './Types';
import {
  // Statement,
  Program,
  // CommandLine
} from "./Ast";
import { Env } from "./Env";

export class Evaluator implements IEvaluator {
  public eval (node: IAstNode, env: Env) {
    // Have to make use of constructor instead of interface,
    // since switch-case based on implement-interface is currently not supported
    switch (node.constructor) {
      case Program:
        return this._evalProgram(node as Program, env);
    }
  }

  private _evalProgram (program: Program, env: Env) {
    let result: any;

    for (let statement of program.statements) {
      result = this.eval(statement, env);
    }

    return result;
  }
}

import {
  IAstNode,
  IEvaluator,
  IEnvironment
} from './types';
import {
  // Statement,
  Program,
  // CommandLine
} from "./Ast";
// import { Environment } from "./Environment";

export class Evaluator implements IEvaluator {
  public eval (node: IAstNode, env: IEnvironment) {
    // Have to make use of constructor instead of interface,
    // since switch-case based on implement-interface is currently not supported
    switch (node.constructor) {
      case Program:
        return this._evalProgram(node as Program, env);
    }
  }

  private _evalProgram (program: Program, env: IEnvironment) {
    let result: any;

    for (let node of program.nodes) {
      result = this.eval(node, env);
    }

    return result;
  }
}

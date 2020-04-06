import {
  AstCommandLine,
  AstProgram,
} from "./Ast";
import {
  ExitStatus,
  IAstNode,
  ICommandMap,
  IContext,
  IEvaluator,
  IEnvironment,
} from "./types";

export class Evaluator<T extends IContext> implements IEvaluator {
  private _environment: IEnvironment;
  private _commandMap: ICommandMap<T>;
  private _context: T;

  constructor ({
    environment,
    commandMap,
    context,
  }: {
    environment: IEnvironment;
    commandMap: ICommandMap<T>;
    context: T;
  }) {
    this._environment = environment;
    this._commandMap = commandMap;
    this._context = context;
  }

  public eval (node: IAstNode) {
    // Have to make use of constructor instead of interface,
    // since switch-case based on implement-interface is currently not supported
    switch (node.constructor) {
      case AstProgram:
        return this._evalProgram(node as AstProgram);
      case AstCommandLine:
        return this._evalCommandLine(node as AstCommandLine);
    }
  }

  private _evalProgram (program: AstProgram) {
    for (const node of program.nodes) {
      this.eval(node);
      if (this._environment.exitStatus !== ExitStatus.Success) {
        break;
      }
    }
  }

  private _evalCommandLine (commandLine: AstCommandLine) {
    const command = commandLine.args[0].tokenLiteral();
    const func = this._commandMap[command];

    if (typeof func !== "function") {
      this._environment.error(1, `command not found: ${command}`);
      return;
    }

    func({
      args: commandLine.args.map((a: IAstNode) => a.toString()),
      environment: this._environment,
      context: this._context,
    });
  }
}

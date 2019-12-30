import {
  IFileSystem,
} from "mash-filesystem";

import {
  AstCommandLine,
  AstProgram,
} from "./Ast";
import { builtins } from "./builtins";
import {
  ExitStatus,
  IAstNode,
  IEnvironment,
  IEvaluator,
} from "./types";

export class Evaluator implements IEvaluator {
  private _fileSystem: IFileSystem;
  private _environment: IEnvironment;

  constructor (
    fs: IFileSystem,
    env: IEnvironment,
  ) {
    this._environment = env;
    this._fileSystem = fs;
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
    const func = builtins[command];

    if (typeof func !== "function") {
      this._environment.error(1, `command not found: ${command}`);
      return;
    }

    func({
      args: commandLine.args.map((a: IAstNode) => a.toString()),
      fileSystem: this._fileSystem,
      environment: this._environment,
    });
  }
}

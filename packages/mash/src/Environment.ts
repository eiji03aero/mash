import {
  IFileSystem,
} from "mash-filesystem";
import { Evaluator } from "./Evaluator";
import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import {
  EnvironmentWriteHandler,
  ExitStatus,
  IEnvironment,
} from "./types";

export class Environment implements IEnvironment {

  static get instance() {
    return this._instance;
  }

  public get exitStatus() {
    return this._exitStatus;
  }

  public static bootstrap(fs: IFileSystem) {
    this._instance = new this(fs);
    return this._instance;
  }
  private static _instance: IEnvironment;
  private _exitStatus: ExitStatus;
  private _environmentWriteHandler: EnvironmentWriteHandler;

  private constructor(
    private _fileSystem: IFileSystem,
  ) {
    this._exitStatus = ExitStatus.Success;
    this._environmentWriteHandler = ([]: any) => {};
  }

  public eval(str: string) {
    this._resetEnvironment();

    const lexer = new Lexer(str);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const evaluator = new Evaluator(this._fileSystem, this);
    evaluator.eval(program);
  }

  public error(code: ExitStatus, message?: string) {
    if (message) {
      const msg = `mash ${message}`;
      this._environmentWriteHandler(msg);
    }

    this._exitStatus = code;
  }

  public writeln(str: string) {
    this._environmentWriteHandler(str);
  }

  public onWrite(func: EnvironmentWriteHandler) {
    this._environmentWriteHandler = func;
  }

  private _resetEnvironment() {
    this._exitStatus = ExitStatus.Success;
  }
}

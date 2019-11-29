import {
  text
} from 'mash-common';
import {
  IFileSystem
} from 'mash-filesystem';
import {
  IEnvironment,
  ExitStatus,
  EnvironmentWriteHandler,
} from './types';
import { Evaluator } from './Evaluator';
import { Lexer } from './Lexer';
import { Parser } from './Parser';

export class Environment implements IEnvironment {
  private static _instance: IEnvironment;
  private _exitStatus: ExitStatus;
  private _environmentWriteHandler: EnvironmentWriteHandler;

  static bootstrap (fs: IFileSystem) {
    this._instance = new this(fs);
    return this._instance;
  }

  static get instance () {
    return this._instance;
  }

  private constructor (
    private _fileSystem: IFileSystem
  ) {
    this._exitStatus = ExitStatus.Success;
    this._environmentWriteHandler = ([]: any) => {};
  }

  public get exitStatus () {
    return this._exitStatus;
  }

  public eval (str: string) {
    this._resetEnvironment();

    const lexer = new Lexer(str);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const evaluator = new Evaluator(this._fileSystem, this);
    evaluator.eval(program);
  }

  public error (code: ExitStatus, message?: string) {
    if (message) {
      const msg = `mash ${message}`;
      this._environmentWriteHandler([{text: msg}]);
    }

    this._exitStatus = code;
  }

  public writeln (row: text.row) {
    this._environmentWriteHandler(row);
  }

  public onWrite (func: EnvironmentWriteHandler) {
    this._environmentWriteHandler = func;
  }

  private _resetEnvironment () {
    this._exitStatus = ExitStatus.Success;
  }
}

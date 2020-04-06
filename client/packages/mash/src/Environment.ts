import {
  ExitStatus,
  IEnvironment,
  EnvironmentWriteHandler,
} from "./types";

export class Environment implements IEnvironment {
  private _exitStatus: ExitStatus;
  private _onWritelnHandler: EnvironmentWriteHandler

  constructor ({
    onWriteln,
  }: {
    onWriteln: EnvironmentWriteHandler;
  }) {
    this._exitStatus = ExitStatus.Success;
    this._onWritelnHandler = onWriteln;
  }

  get exitStatus () {
    return this._exitStatus;
  }

  onWriteln (cb: EnvironmentWriteHandler) {
    this._onWritelnHandler = cb;
  }

  writeln (input: string) {
    this._onWritelnHandler(input);
  }

  reset () {
    this._exitStatus = ExitStatus.Success;
  }

  error (code: ExitStatus, message?: string) {
    if (message) {
      const msg = `mash ${message}`;
      this.writeln(msg);
    }

    this._exitStatus = code;
  }
}

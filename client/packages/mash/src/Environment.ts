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

  get exitStatus (): ExitStatus {
    return this._exitStatus;
  }

  onWriteln (cb: EnvironmentWriteHandler): void {
    this._onWritelnHandler = cb;
  }

  writeln (input: string): void {
    this._onWritelnHandler(input);
  }

  reset (): void {
    this._exitStatus = ExitStatus.Success;
  }

  error (code: ExitStatus, message?: string): void {
    if (message) {
      const msg = `mash: ${message}`;
      this.writeln(msg);
    }

    this._exitStatus = code;
  }
}

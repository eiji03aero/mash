import { EventEmitter } from "events";
import { ITerminal, IInputHandler } from "./types";

export class InputHandler implements IInputHandler {
  private _emitter: EventEmitter;
  private _eventTimestamp: number;

  constructor (
    private _terminal: ITerminal
  ) {
    this._emitter = new EventEmitter();
    this._eventTimestamp = 0;

    this._terminal.textarea.addEventListener("keydown", this._onKeyDown.bind(this));
    this._terminal.textarea.addEventListener("keypress", this._onKeyPress.bind(this));
    this._terminal.textarea.addEventListener("keyup", this._onKeyUp.bind(this));
  }

  get onKeyDown () { return this._emitter.on.bind(this._emitter, "keydown"); }
  get onKeyPress () { return this._emitter.on.bind(this._emitter, "keypress"); }
  get onKeyUp () { return this._emitter.on.bind(this._emitter, "keyup"); }

  get offKeyDown () { return this._emitter.off.bind(this._emitter, "keydown"); }
  get offKeyPress () { return this._emitter.off.bind(this._emitter, "keypress"); }
  get offKeyUp () { return this._emitter.off.bind(this._emitter, "keyup"); }

  private _onKeyDown (e: KeyboardEvent) {
    if (!this._checkEventTimeStamp(e)) {
      this._updateByUserInput(e);
    }
    this._emitter.emit("keydown", e);
  }

  private _onKeyPress (e: KeyboardEvent) {
    if (!this._checkEventTimeStamp(e)) {
      this._updateByUserInput(e);
    }
    this._emitter.emit("keypress", e);
  }

  private _onKeyUp (e: KeyboardEvent) {
    if (!this._checkEventTimeStamp(e)) {
      this._updateByUserInput(e);
    }
    this._emitter.emit("keyup", e);
  }

  private _updateByUserInput (e: KeyboardEvent) {
    const str = (e.target as HTMLInputElement).value;
    const rowStr = this._terminal.config.prompt + str;
    this._terminal.updateLastRow(rowStr);
  }

  private _checkEventTimeStamp (e: KeyboardEvent) {
    const prev = this._eventTimestamp;
    this._eventTimestamp = e.timeStamp;
    return prev === this._eventTimestamp;
  }
}

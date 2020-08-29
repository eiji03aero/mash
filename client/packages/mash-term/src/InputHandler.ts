import { EventEmitter } from "events";
import { ITerminal, IInputHandler, KeyboardEventHandlerRegisterer } from "./types";

export class InputHandler implements IInputHandler {
  private _emitter: EventEmitter;
  private _downEt: number;
  private _pressEt: number;
  private _upEt: number;

  constructor (
    private _terminal: ITerminal
  ) {
    const e = new Event("keydown");
    this._emitter = new EventEmitter();
    this._downEt = e.timeStamp;
    this._pressEt = e.timeStamp;
    this._upEt = e.timeStamp;

    this._terminal.textarea.addEventListener("keydown", this._onKeyDown.bind(this));
    this._terminal.textarea.addEventListener("keypress", this._onKeyPress.bind(this));
    this._terminal.textarea.addEventListener("keyup", this._onKeyUp.bind(this));
  }

  get onKey (): KeyboardEventHandlerRegisterer { return this._emitter.on.bind(this._emitter, "key"); }
  get onKeyDown (): KeyboardEventHandlerRegisterer { return this._emitter.on.bind(this._emitter, "keydown"); }
  get onKeyPress (): KeyboardEventHandlerRegisterer { return this._emitter.on.bind(this._emitter, "keypress"); }
  get onKeyUp (): KeyboardEventHandlerRegisterer { return this._emitter.on.bind(this._emitter, "keyup"); }

  get offKey (): KeyboardEventHandlerRegisterer { return this._emitter.off.bind(this._emitter, "key"); }
  get offKeyDown (): KeyboardEventHandlerRegisterer { return this._emitter.off.bind(this._emitter, "keydown"); }
  get offKeyPress (): KeyboardEventHandlerRegisterer { return this._emitter.off.bind(this._emitter, "keypress"); }
  get offKeyUp (): KeyboardEventHandlerRegisterer { return this._emitter.off.bind(this._emitter, "keyup"); }

  private _onKeyDown (e: KeyboardEvent) {
    this._downEt = e.timeStamp;
    // if (!this._shouldThinOut(this._downEt, this._pressEt, this._upEt)) {
    //   this._updateByUserInput(e);
    // }
    this._emitter.emit("keydown", e);
  }

  private _onKeyPress (e: KeyboardEvent) {
    this._pressEt = e.timeStamp;
    if (!this._shouldThinOut(this._pressEt, this._downEt, this._upEt)) {
      this._updateByUserInput(e);
    }
    this._emitter.emit("keypress", e);
  }

  private _onKeyUp (e: KeyboardEvent) {
    this._upEt = e.timeStamp;
    if (!this._shouldThinOut(this._upEt, this._downEt, this._pressEt)) {
      this._updateByUserInput(e);
    }
    this._emitter.emit("keyup", e);
  }

  private _updateByUserInput (e: KeyboardEvent) {
    this._emitter.emit("key", e)
  }

  private _shouldThinOut (et: number, t1: number, t2: number) {
    return (
      this._shouldThinOutByTimeStamp(et, t1)
      || this._shouldThinOutByTimeStamp(et, t2)
    );
  }

  private _shouldThinOutByTimeStamp (e1: number, e2: number) {
    return e1 === e2;
  }
}

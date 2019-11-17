import { text } from 'mash-common';
import { IRenderPayload, ITerminal } from '../Types';
import { BaseRenderLayer } from './BaseRenderLayer';

type ids = number[];

export class CursorRenderLayer extends BaseRenderLayer {
  private _blinkTimeoutIds: ids;
  private _blinkIntervalIds: ids;
  private _isCursorShown: boolean;

  constructor (
    terminal: ITerminal,
    zIndex: number,
  ) {
    super(terminal, zIndex);
    this._blinkTimeoutIds = [] as ids;
    this._blinkIntervalIds = [] as ids;
    this._isCursorShown = false;
  }

  render = (_: IRenderPayload) => {
    this.clear();
    this._clearIntervals();
    this._beginBlinkCursor();
  }

  private _clearIntervals () {
    this._blinkTimeoutIds.forEach(window.clearTimeout);
    this._blinkTimeoutIds = [] as ids;
    this._blinkIntervalIds.forEach(window.clearInterval);
    this._blinkIntervalIds = [] as ids;
  }

  private _beginBlinkCursor () {
    this._isCursorShown = true;
    this._showBlockCursor();

    const timeoutId = window.setTimeout(() => {
      const intervalId = window.setInterval(() => {
        this._isCursorShown = !this._isCursorShown;
        if (this._isCursorShown) {
          this._showBlockCursor();
        }
        else {
          this.clear();
        }
      }, this.terminal.config.cursorIntervalMs);
      this._blinkIntervalIds.push(intervalId);
    }, this.terminal.config.cursorInitialPauseMs);

    this._blinkTimeoutIds.push(timeoutId);
  }

  private _showBlockCursor () {
    this.ctx.save();

    this.setTextBaseStyle();
    this.ctx.fillStyle = this.terminal.config.cursorBg;
    this.ctx.fillRect(
      this._cursorX,
      this._cursorY + this.terminal.config.rowTopMargin,
      this._cursorCharWidth,
      this._cursorCharHeight + this.terminal.config.rowBottomMargin
    );

    this.ctx.fillStyle = this.terminal.config.textWhite;
    this.ctx.fillText(
      this._cursorChar,
      this._cursorX,
      this._cursorY + this.terminal.config.rowTopMargin + this.terminal.config.fontSize
    );

    this.ctx.restore();
  }

  private get _cursorChar () {
    const selectionStart = this.terminal.textarea.selectionStart;
    const value = this.terminal.textarea.value;
    const isEmpty = value === '';
    const isAtEnd = selectionStart === value.length;
    return isEmpty || isAtEnd
      ? ' '
      : this.terminal.textarea.value.slice(selectionStart, selectionStart + 1);
  }

  private get _cursorX () {
    const promptWidth = this.terminal.config.prompt
      .map((t: text.TextObject) => this.ctx.measureText(t.text).width)
      .reduce((accum: number, cur: number) => accum + cur, 0);
    const inputLength = this.terminal.textarea.value === ""
      ? 0
      : this.ctx.measureText(this.terminal.textarea.value.slice(0, this.terminal.textarea.selectionStart)).width;
    return this.terminal.config.rowLeftMargin + promptWidth + inputLength;
  }

  private get _cursorY () {
    const index = this.terminal.relativePromptRowPosition;
    const height = this.terminal.rowHeight;
    return index * height;
  }

  private get _cursorCharWidth () {
    return this.ctx.measureText(this._cursorChar).width;
  }

  private get _cursorCharHeight () {
    return this.terminal.config.fontSize;
  }
}

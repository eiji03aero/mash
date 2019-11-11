import _ from 'lodash';
import { text } from 'mash-common';
import {
  KeyboardEventHandler,
  ITerminal,
  IRenderer,
  IConfig,
  IRenderPayload
} from './Types';
import { Renderer } from './renderer';
import { getConfig } from './common/Config';

export class Terminal implements ITerminal {
  public container: HTMLElement;
  public renderer: IRenderer;
  public textarea: HTMLTextAreaElement;
  public config: IConfig;
  public rows: text.rows;
  public rowPosition: number;
  private _onKeyPressHandler: (e: KeyboardEvent) => void;

  constructor (
    container: HTMLElement,
    config: any
  ) {
    this.container = container;

    this.textarea = document.createElement('textarea');
    this.textarea.setAttribute('style', 'width: 0; height: 0; position: absolute;');
    this.container.appendChild(this.textarea);
    this.config = getConfig(config);
    this.rows = [] as text.rows;
    this.rowPosition = 0;
    this.renderer = new Renderer(this.container);

    this._onKeyPressHandler = (_: KeyboardEvent) => {};

    window.addEventListener('resize', this._onResize);
    document.addEventListener('click', this._onDocumentClick);
    this.container.addEventListener('wheel', this._onContainerWheel);
    this.textarea.addEventListener('keyup', this._onKeyUp);
    this.textarea.addEventListener('keypress', this._onKeyPress);
  }

  public focus () {
    this.textarea.focus();
  }

  public blur () {
    this.textarea.blur();
  }

  public prompt () {
    this.textarea.value = "";
    this.rows.push([
      ...this.config.prompt,
      { text: "" }
    ]);
    this._render({ appendIfNeeded: true });
  }

  public writeln (texts: text.row) {
    this.rows.push(texts);
    this._render({ appendIfNeeded: true });
  }

  public scroll (numberToScroll: number) {
    const nextPosition = this.rowPosition + numberToScroll;
    const shouldBeOnTop = (
      nextPosition < 0
    );
    const shouldBeOnBottom = nextPosition >= this._bottomPosition;

    this.rowPosition = (
      shouldBeOnTop ? 0 :
      shouldBeOnBottom ? this._bottomPosition :
      nextPosition
    );
    this._render();
  }

  public scrollToBottom () {
    this.rowPosition = this._bottomPosition;
    this._render();
  }

  public onKeyPress (fn: KeyboardEventHandler) {
    this._onKeyPressHandler = fn;
  }

  private get _renderPayload (): IRenderPayload {
    return {
      rows: this.rows,
      displayedRows: this.rows.slice(this.rowPosition, this.rowPosition + this._numberOfDisplayedRows),
      rowPosition: this.rowPosition,
      rowHeight: this._rowHeight,
      numberOfDisplayedRows: this._numberOfDisplayedRows,
      config: this.config
    };
  }

  private get _bottomPosition () {
    const bottomPosition = this.rows.length - this._numberOfDisplayedRows;
    return bottomPosition >= 0
      ? bottomPosition
      : 0;
  }

  private get _rowHeight () {
    return this.config.fontSize + this.config.rowTopMargin;
  }

  private get _numberOfDisplayedRows () {
    return Math.floor(this.container.offsetHeight / this._rowHeight);
  }

  private get _isOnBottom () {
    if (this.rows.length < this._numberOfDisplayedRows) return false;
    return this.rows.length >= this.rowPosition + this._numberOfDisplayedRows + 1;
  }

  private _render (
    option?: {
      appendIfNeeded?: boolean
    }
  ) {
    if (typeof option !== 'undefined') {
      if (option.appendIfNeeded && this._isOnBottom) {
        this.rowPosition += 1;
      }
    }
    this.renderer.render(this._renderPayload);
  }

  private _onDocumentClick = (e: Event) => {
    if (this.container.contains(e.target as HTMLElement)) {
      this.focus();
    } else {
      this.blur();
    }
  }

  private _onResize = (_: Event) => {
    this.renderer.resize(this._renderPayload);
  }

  private _onContainerWheel = _.throttle((e: WheelEvent) => {
    const rowToScroll = e.deltaY > 0 ? 1 : -1;
    this.scroll(rowToScroll);

  }, 50);

  private _onKeyPress = (e: KeyboardEvent) => {
    this._onKeyPressHandler(e);
  }

  private _onKeyUp = (e: Event) => {
    const lastRow = this.rows[this.rows.length - 1];
    const lastTextObject = lastRow[lastRow.length - 1];
    lastTextObject.text = (e.target as HTMLInputElement).value;
    this._render();
  }
}

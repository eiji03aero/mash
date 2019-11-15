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
  public isCursorShown: boolean;
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
    this.isCursorShown = true;
    this.renderer = new Renderer(this);

    this._onKeyPressHandler = (_: KeyboardEvent) => {};

    window.addEventListener('resize', this._onResize);
    document.addEventListener('click', this._onDocumentClick);
    this.container.addEventListener('wheel', this._onContainerWheel);
    this.textarea.addEventListener('keyup', this._onKeyUp);
    this.textarea.addEventListener('keypress', this._onKeyPress);

    this.focus();
  }

  public get relativePromptRowPosition () {
    return this.rows.length - 1 - this.rowPosition;
  }

  public get rowHeight () {
    return this.config.fontSize + this.config.rowTopMargin + this.config.rowBottomMargin;
  }

  public focus () {
    this.textarea.focus();
  }

  public blur () {
    this.textarea.blur();
  }

  public prompt () {
    if (this._isOnBottom) {
      this.rowPosition += 1;
    }

    this.textarea.value = "";
    this.rows.push([
      ...this.config.prompt,
      { text: "" }
    ]);
    this._render();
  }

  public writeln (texts: text.row) {
    if (this._isOnBottom) {
      this.rowPosition += 1;
    }

    this.rows.push(texts);
    this._render();
  }

  public scroll (numberToScroll: number) {
    const nextPosition = this.rowPosition + numberToScroll;
    const shouldBeOnTop = nextPosition < 0;
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
      rowHeight: this.rowHeight,
      numberOfDisplayedRows: this._numberOfDisplayedRows,
      config: this.config,
      textarea: this.textarea
    };
  }

  private get _bottomPosition () {
    const bottomPosition = this.rows.length - this._numberOfDisplayedRows;
    return Math.max(bottomPosition, 0);
  }

  private get _numberOfDisplayedRows () {
    return Math.floor(this.container.offsetHeight / this.rowHeight);
  }

  private get _isOnBottom () {
    if (this.rows.length < this._numberOfDisplayedRows) return false;
    return this.rowPosition === this.rows.length - this._numberOfDisplayedRows;
  }

  private _render () {
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
    const stride = Math.abs(e.deltaY);
    const modifier =
      stride < 2 ? 0 :
      stride < 8 ? 1 :
      stride < 24 ? 2 :
      stride < 48 ? 4 :
      6;
    const direction = e.deltaY > 0 ? 1 : -1;
    this.scroll(direction * modifier);
  }, 50);

  private _onKeyPress = (e: KeyboardEvent) => {
    this._onKeyPressHandler(e);
  }

  private _onKeyUp = (e: Event) => {
    if (!this._isOnBottom) {
      this.scrollToBottom();
    }
    const lastRow = this.rows[this.rows.length - 1];
    const lastTextObject = lastRow[lastRow.length - 1];
    lastTextObject.text = (e.target as HTMLInputElement).value;
    this._render();
  }
}

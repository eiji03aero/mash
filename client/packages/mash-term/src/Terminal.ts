import _ from "lodash";
import { getConfig } from "./common/Config";
import { Renderer } from "./renderer";
import { CalculateService } from "./services";
import { InputHandler } from "./InputHandler";
import { Buffer } from "./Buffer";
import {
  ICalculateService,
  IConfig,
  IRenderer,
  IRenderPayload,
  ITerminal,
  IInputHandler,
  IBuffer,
} from "./types";

export class Terminal implements ITerminal {
  container: HTMLElement;
  textarea: HTMLTextAreaElement;
  config: IConfig;

  private _renderer: IRenderer;
  private _calculateService: ICalculateService;
  private _buffer: IBuffer;
  private _inputHandler: IInputHandler;

  constructor (
    container: HTMLElement,
    cfg?: any,
  ) {
    const config = cfg || {} as IConfig;

    this.container = container;
    this.textarea = document.createElement("textarea");
    this.textarea.setAttribute("style", "width: 0; height: 0; position: absolute;");
    this.container.appendChild(this.textarea);

    this.config = getConfig(config);

    this._calculateService = new CalculateService(this);
    this._renderer = new Renderer(this);
    this._inputHandler = new InputHandler(this);
    this._buffer = new Buffer(this, this._calculateService);

    window.addEventListener("resize", this._onResize);
    document.addEventListener("click", this._onDocumentClick);
    this.container.addEventListener("wheel", this._onContainerWheel);

    this.focus();
  }

  get onKeyDown () { return this._inputHandler.onKeyDown; }
  get onKeyPress () { return this._inputHandler.onKeyPress; }
  get onKeyUp () { return this._inputHandler.onKeyDown; }
  get offKeyDown () { return this._inputHandler.offKeyDown; }
  get offKeyPress () { return this._inputHandler.offKeyPress; }
  get offKeyUp () { return this._inputHandler.offKeyDown; }


  get relativePromptRowPosition () {
    return this._buffer.rows.length - 1 - this._buffer.rowPosition;
  }

  get rowHeight () {
    return this.config.fontSize + this.config.rowTopMargin + this.config.rowBottomMargin;
  }

  get windowStat () {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    return {
      width,
      height,
      availableWidth: width - this.config.rowLeftMargin - this.config.rowRightMargin,
      availableHeight: height - this.config.rowTopMargin - this.config.rowBottomMargin,
    };
  }

  measureText (str: string) {
    return this._calculateService.measureText(str);
  }

  focus () {
    this.textarea.focus();
  }

  blur () {
    this.textarea.blur();
  }

  prompt () {
    if (this._buffer.isOnBottom) {
      this._buffer.rowPosition += 1;
    }

    this.textarea.value = "";
    this.appendRow(this.config.prompt);
    this.showCursor();
    this._render();
  }

  clear () {
    this._buffer.rowPosition = this._buffer.rows.length;
    this._render();
  }

  showCursor () {
    this._renderer.showCursor();
  }

  hideCursor () {
    this._renderer.hideCursor();
  }

  writeln (str: string) {
    if (this._buffer.isOnBottom) {
      this._buffer.rowPosition += 1;
    }

    this.appendRow(str);
    this._render();
  }

  appendRow (str: string) {
    this._buffer.appendRow(str);
  }

  updateRowByIndex (idx: number, str: string) {
    this._buffer.updateRowByIndex(idx, str);
    this._render();
  }

  updateLastRow (str: string) {
    this.updateRowByIndex(this._buffer.rows.length - 1, str);
  }

  scroll (numberToScroll: number) {
    this._buffer.scroll(numberToScroll);
    this._render();
  }

  scrollToBottom () {
    this._buffer.scrollToBottom();
    this._render();
  }

  private get _renderPayload (): IRenderPayload {
    return {
      rows: this._buffer.rows,
      displayedRows: this._buffer.displayedRows,
      rowPosition: this._buffer.rowPosition,
      rowHeight: this.rowHeight,
      numberOfDisplayedRows: this._buffer.numberOfDisplayedRows,
      config: this.config,
      textarea: this.textarea,
    };
  }

  private _render () {
    this._renderer.render(this._renderPayload);
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

  private _onDocumentClick = (e: Event) => {
    if (this.container.contains(e.target as HTMLElement)) {
      this.focus();
    } else {
      this.blur();
    }
  }

  private _onResize = (_: Event) => {
    this._buffer.updateRows();
    this._renderer.resize(this._renderPayload);
  }
}

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
  KeyboardEventHandlerRegisterer,
  CachedRows,
  IWindowStat,
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
    cfg?: Partial<IConfig>,
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
    this.container.addEventListener("click", this._onContainerClick);
    this.container.addEventListener("wheel", this._onContainerWheel);
    this.textarea.addEventListener("focus", (_: Event) => {
      this.showCursor();
    });
    this.textarea.addEventListener("blur", (_: Event) => {
      this.hideCursor();
    });

    this.focus();
  }

  get onKey (): KeyboardEventHandlerRegisterer { return this._inputHandler.onKey; }
  get onKeyDown (): KeyboardEventHandlerRegisterer { return this._inputHandler.onKeyDown; }
  get onKeyPress (): KeyboardEventHandlerRegisterer { return this._inputHandler.onKeyPress; }
  get onKeyUp (): KeyboardEventHandlerRegisterer { return this._inputHandler.onKeyDown; }
  get offKey (): KeyboardEventHandlerRegisterer { return this._inputHandler.offKey; }
  get offKeyDown (): KeyboardEventHandlerRegisterer { return this._inputHandler.offKeyDown; }
  get offKeyPress (): KeyboardEventHandlerRegisterer { return this._inputHandler.offKeyPress; }
  get offKeyUp (): KeyboardEventHandlerRegisterer { return this._inputHandler.offKeyDown; }


  get rows (): CachedRows {
    return this._buffer.rows;
  }
  get rawRows (): string[] {
    return this._buffer.rawRows;
  }

  get relativePromptRowPosition (): number {
    return this._buffer.rows.length - 1 - this._buffer.rowPosition;
  }

  get rowHeight (): number {
    return this.config.fontSize + this.config.rowTopMargin + this.config.rowBottomMargin;
  }

  get windowStat (): IWindowStat {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    return {
      width,
      height,
      availableWidth: width - this.config.rowLeftMargin - this.config.rowRightMargin,
      availableHeight: height - this.config.rowTopMargin - this.config.rowBottomMargin,
    };
  }

  measureText (str: string): TextMetrics {
    return this._calculateService.measureText(str);
  }

  focus (): void {
    this.textarea.focus();
  }

  blur (): void {
    this.textarea.blur();
  }

  prompt (): void {
    this.textarea.value = "";
    this.appendRow(this.config.prompt);
    this._scrollToBottomIfNecessary();

    this.showCursor();
    this._render();
  }

  clear (): void {
    this._buffer.rowPosition = this._buffer.rows.length;
    this._render();
  }

  showCursor (): void {
    this._renderer.showCursor();
  }

  hideCursor (): void {
    this._renderer.hideCursor();
  }

  writeln (str: string): void {
    this.appendRow(str);
    this._scrollToBottomIfNecessary();

    this._render();
  }

  appendRow (str: string): void {
    this._buffer.appendRow(str);
  }

  updateRowByIndex (idx: number, str: string): void {
    this._buffer.updateRowByIndex(idx, str);
    this._render();
  }

  scroll (numberToScroll: number): void {
    this._buffer.scroll(numberToScroll);
    this._render();
  }

  scrollToBottom (): void {
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

  private _scrollToBottomIfNecessary () {
    if (this._buffer.isOnBottom) {
      this.scrollToBottom();
    }
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

  private _onContainerClick = (e: Event) => {
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

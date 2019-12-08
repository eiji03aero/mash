import _ from "lodash";
import { text } from "mash-common";
import { getConfig } from "./common/Config";
import { Renderer } from "./renderer";
import { CalculateService } from "./services";
import {
  ICalculateService,
  IConfig,
  IRenderer,
  IRenderPayload,
  ITerminal,
  KeyboardEventHandler,
} from "./types";

export class Terminal implements ITerminal {

  public get relativePromptRowPosition() {
    return this._cachedRows.length - 1 - this.rowPosition;
  }

  public get rowHeight() {
    return this.config.fontSize + this.config.rowTopMargin + this.config.rowBottomMargin;
  }

  private get _renderPayload(): IRenderPayload {
    return {
      rows: this._cachedRows,
      displayedRows: this._cachedRows.slice(this.rowPosition, this.rowPosition + this._numberOfDisplayedRows),
      rowPosition: this.rowPosition,
      rowHeight: this.rowHeight,
      numberOfDisplayedRows: this._numberOfDisplayedRows,
      config: this.config,
      textarea: this.textarea,
    };
  }

  private get _bottomPosition() {
    const bottomPosition = this.rows.length - this._numberOfDisplayedRows;
    return Math.max(bottomPosition, 0);
  }

  private get _numberOfDisplayedRows() {
    return Math.floor(this.container.offsetHeight / this.rowHeight);
  }

  private get _isOnBottom() {
    if (this.rows.length < this._numberOfDisplayedRows) { return false; }
    return this.rowPosition === this.rows.length - this._numberOfDisplayedRows;
  }
  public container: HTMLElement;
  public textarea: HTMLTextAreaElement;
  public config: IConfig;
  public rows: text.Rows;
  public rowPosition: number;
  public isCursorShown: boolean;
  public renderer: IRenderer;
  public calculateService: ICalculateService;
  private _cachedRows: text.Rows;
  private _onKeyPressHandler: (e: KeyboardEvent) => void;

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

  constructor(
    container: HTMLElement,
    config: any,
  ) {
    this.container = container;

    this.textarea = document.createElement("textarea");
    this.textarea.setAttribute("style", "width: 0; height: 0; position: absolute;");
    this.container.appendChild(this.textarea);
    this.config = getConfig(config);
    this.rows = [] as text.Rows;
    this.rowPosition = 0;
    this.isCursorShown = true;
    this._cachedRows = [] as text.Rows;
    this.renderer = new Renderer(this);
    this.calculateService = new CalculateService(this);

    this._onKeyPressHandler = (_: KeyboardEvent) => {};

    window.addEventListener("resize", this._onResize);
    document.addEventListener("click", this._onDocumentClick);
    this.container.addEventListener("wheel", this._onContainerWheel);
    this.textarea.addEventListener("keyup", this._onKeyUp);
    this.textarea.addEventListener("keypress", this._onKeyPress);

    this.focus();
  }

  public focus() {
    this.textarea.focus();
  }

  public blur() {
    this.textarea.blur();
  }

  public prompt() {
    if (this._isOnBottom) {
      this.rowPosition += 1;
    }

    this.textarea.value = "";
    this.appendRow([
      ...this.config.prompt,
      { text: "" },
    ]);
    this._render();
  }

  public writeln(texts: text.Row) {
    if (this._isOnBottom) {
      this.rowPosition += 1;
    }

    this.appendRow(texts);
    this._render();
  }

  public appendRow(texts: text.Row) {
    this.rows.push(texts);
    this._updateCachedRows();
  }

  public scroll(numberToScroll: number) {
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

  public scrollToBottom() {
    this.rowPosition = this._bottomPosition;
    this._render();
  }

  public onKeyPress(fn: KeyboardEventHandler) {
    this._onKeyPressHandler = fn;
  }

  private _render() {
    this.renderer.render(this._renderPayload);
  }

  private _updateCachedRows() {
    this._cachedRows = this.rows.reduce((accum: text.Rows, cur: text.Row) => {
      const splitRows = this._splitRowWithLimit(cur);
      return accum.concat(splitRows);
    }, [] as text.Rows);
  }

  private _splitRowWithLimit(row: text.Row) {
    const { rowLeftMargin, rowRightMargin } = this.config;
    const availableWidth = this.container.offsetWidth - rowLeftMargin - rowRightMargin;
    const rs = [] as text.Rows;
    let tmpWidth = 0;

    rs.push([] as text.Row);

    for (let ti = 0; ti < row.length; ti++) {
      const t = row[ti];
      rs[rs.length - 1].push({ ...t, text: "" });

      for (let ci = 0; ci < t.text.length; ci++) {
        const c = t.text[ci];

        tmpWidth += this.calculateService.measureText(c).width;

        if (tmpWidth <= availableWidth) {
          const lastRow = rs[rs.length - 1];
          const lastTextObject = lastRow[lastRow.length - 1];
          lastTextObject.text += c;
        } else {
          const newRow = [] as text.Row;
          const newTextObject = { ...t, text: c };
          newRow.push(newTextObject);
          rs.push(newRow);

          tmpWidth = 0;
        }
      }
    }

    return rs;
  }

  private _onDocumentClick = (e: Event) => {
    if (this.container.contains(e.target as HTMLElement)) {
      this.focus();
    } else {
      this.blur();
    }
  }

  private _onResize = (_: Event) => {
    this._updateCachedRows();
    this.renderer.resize(this._renderPayload);
  }

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
    this._updateCachedRows();
    this._render();
  }
}

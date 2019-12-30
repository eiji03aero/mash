import _ from "lodash";
import { text, Row } from "mash-common";
import { getConfig } from "./common/Config";
import { Renderer } from "./renderer";
import { CalculateService } from "./services";
import {
  ICalculateService,
  IConfig,
  IRenderer,
  IRenderPayload,
  ITerminal,
  CachedRows,
  IParsedRow,
  KeyboardEventHandler,
} from "./types";

export class Terminal implements ITerminal {
  public container: HTMLElement;
  public textarea: HTMLTextAreaElement;
  public config: IConfig;
  public rows: string[];
  public rowPosition: number;
  public isCursorShown: boolean;
  public renderer: IRenderer;
  public calculateService: ICalculateService;
  private _cachedRows: CachedRows;
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
    this.rows = [] as string[];
    this.rowPosition = 0;
    this.isCursorShown = true;
    this._cachedRows = [] as CachedRows;
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

  public get relativePromptRowPosition () {
    return this._cachedRows.length - 1 - this.rowPosition;
  }

  public get rowHeight () {
    return this.config.fontSize + this.config.rowTopMargin + this.config.rowBottomMargin;
  }

  public getWindowStat () {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    return {
      width,
      height,
      availableWidth: width - this.config.rowLeftMargin - this.config.rowRightMargin,
      availableHeight: height - this.config.rowTopMargin - this.config.rowBottomMargin,
    };
  }

  public measureText (str: string) {
    return this.calculateService.measureText(str);
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
    this.appendRow(this.config.prompt);
    this._render();
  }

  public clear () {
    this.rowPosition = this._cachedRows.length;
    this._render();
  }

  public writeln (str: string) {
    if (this._isOnBottom) {
      this.rowPosition += 1;
    }

    this.appendRow(str);
    this._render();
  }

  public appendRow (str: string) {
    this.rows.push(str);
    this._updateCachedRows();
  }

  public updateRowByIndex (idx: number, str: string) {
    this.rows = this.rows.map((s: string, i: number) => {
      return i === idx
        ? str
        : s;
    });

    const cfIdx = _.findIndex(this._cachedRows, (r: IParsedRow) => {
      return r.rowIndex === idx;
    });
    const clIdx = _.findLastIndex(this._cachedRows, (r: IParsedRow) => {
      return r.rowIndex === idx;
    });

    const former = this._cachedRows.slice(0, cfIdx);
    const latter = this._cachedRows.slice(clIdx + 1, this._cachedRows.length);
    const splitted = this._splitRowWithLimit(str, idx);

    this._cachedRows = [
      ...former,
      ...splitted,
      ...latter
    ] as CachedRows;
  }

  public scroll (numberToScroll: number) {
    const nextPosition = this.rowPosition + numberToScroll;
    const shouldBeOnTop = nextPosition < 0;
    const shouldBeOnBottom = nextPosition >= this._cachedRows.length;

    this.rowPosition = (
      shouldBeOnTop ? 0 :
      shouldBeOnBottom ? this._cachedRows.length - 1 :
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
      rows: this._cachedRows,
      displayedRows: this._cachedRows.slice(this.rowPosition, this.rowPosition + this._numberOfDisplayedRows),
      rowPosition: this.rowPosition,
      rowHeight: this.rowHeight,
      numberOfDisplayedRows: this._numberOfDisplayedRows,
      config: this.config,
      textarea: this.textarea,
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
    if (this.rows.length < this._numberOfDisplayedRows) { return false; }
    return this.rowPosition === this.rows.length - this._numberOfDisplayedRows;
  }

  private _render () {
    this.renderer.render(this._renderPayload);
  }

  private _updateCachedRows () {
    this._cachedRows = this.rows.reduce((accum: CachedRows, cur: string) => {
      const splitRows = this._splitRowWithLimit(cur, accum.length);
      return accum.concat(splitRows);
    }, [] as CachedRows);
  }

  private _splitRowWithLimit (str: string, idx: number) {
    const row = text.parseColorString(str);
    const { rowLeftMargin, rowRightMargin } = this.config;
    const availableWidth = this.container.offsetWidth - rowLeftMargin - rowRightMargin;
    const rs = [] as CachedRows;
    let tmpWidth = 0;

    const getNewRow = () => ({ rowIndex: idx, row: [] as Row });

    rs.push(getNewRow());

    for (let ti = 0; ti < row.length; ti++) {
      const t = row[ti];
      rs[rs.length - 1].row.push({ ...t, text: "" });

      for (let ci = 0; ci < t.text.length; ci++) {
        const c = t.text[ci];

        tmpWidth += this.measureText(c).width;

        if (tmpWidth <= availableWidth) {
          const lastRow = rs[rs.length - 1];
          const lastTextObject = lastRow.row[lastRow.row.length - 1];
          lastTextObject.text += c;
        } else {
          const newRow = getNewRow();
          const newTextObject = { ...t, text: c };
          newRow.row.push(newTextObject);
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
    const start = performance.now();
    const str = (e.target as HTMLInputElement).value;
    const rowStr = this.config.prompt + str;
    this.updateRowByIndex(this.rows.length - 1, rowStr);
    console.log(this._cachedRows.length, performance.now() - start);
    this._render();
  }
}

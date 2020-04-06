import _ from "lodash";

import { text, Row } from "mash-common";
import {
  IBuffer,
  ITerminal,
  CachedRows,
  ICalculateService,
  IParsedRow,
} from "./types";

export class Buffer implements IBuffer {
  rowPosition: number;
  rawRows: string[];
  rows: CachedRows;

  constructor (
    private _terminal: ITerminal,
    private _calculateService: ICalculateService,
  ) {
    this.rowPosition = 0;
    this.rawRows = [] as string[];
    this.rows = [] as CachedRows;

    this._splitRowWithLimit;
  }

  get isOnBottom () {
    if (this.rows.length < this.numberOfDisplayedRows) return false;
    return this.rowPosition === this.rows.length - this.numberOfDisplayedRows;
  }

  get bottomPosition () {
    const bottomPosition = this.rows.length - this.numberOfDisplayedRows;
    return Math.max(bottomPosition, 0);
  }

  get numberOfDisplayedRows () {
    const { height } = this._terminal.windowStat;
    return Math.floor(height / this._terminal.rowHeight);
  }

  get displayedRows () {
    return this.rows.slice(this.rowPosition, this.rowPosition + this.numberOfDisplayedRows);
  }

  appendRow (str: string) {
    this.rawRows.push(str);
    this.updateRows();
  }

  updateRowByIndex (idx: number, str: string) {
    this.rawRows = this.rawRows.map((s: string, i: number) => {
      return i === idx
        ? str
        : s;
    });

    const cfIdx = _.findIndex(this.rows, (r: IParsedRow) => {
      return r.rowIndex === idx;
    });
    const clIdx = _.findLastIndex(this.rows, (r: IParsedRow) => {
      return r.rowIndex === idx;
    });

    const former = this.rows.slice(0, cfIdx);
    const latter = this.rows.slice(clIdx + 1, this.rows.length);
    const splitted = this._splitRowWithLimit(str, idx);

    this.rows = [
      ...former,
      ...splitted,
      ...latter
    ] as CachedRows;
  }

  updateRows () {
    this.rows = this.rawRows.reduce((accum: CachedRows, cur: string) => {
      const splitRows = this._splitRowWithLimit(cur, accum.length);
      return accum.concat(splitRows);
    }, [] as CachedRows);
  }

  scroll (numberToScroll: number) {
    const nextPosition = this.rowPosition + numberToScroll;
    const shouldBeOnTop = nextPosition < 0;
    const shouldBeOnBottom = nextPosition >= this.rows.length;

    this.rowPosition = (
      shouldBeOnTop ? 0 :
      shouldBeOnBottom ? this.rows.length - 1 :
      nextPosition
    );
  }

  scrollToBottom () {
    this.rowPosition = this.bottomPosition;
  }

  private _splitRowWithLimit (str: string, idx: number) {
    const row = text.parseColorString(str);
    const { availableWidth } = this._terminal.windowStat;
    const rs = [] as CachedRows;
    let tmpWidth = 0;

    const getNewRow = () => ({ rowIndex: idx, row: [] as Row });

    rs.push(getNewRow());

    for (let ti = 0; ti < row.length; ti++) {
      const t = row[ti];
      rs[rs.length - 1].row.push({ ...t, text: "" });

      for (let ci = 0; ci < t.text.length; ci++) {
        const c = t.text[ci];

        tmpWidth += this._calculateService.measureText(c).width;

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
}

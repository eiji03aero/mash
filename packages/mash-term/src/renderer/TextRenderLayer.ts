import { text } from 'mash-common';
import { BaseRenderLayer } from './BaseRenderLayer';

export class TextRenderLayer extends BaseRenderLayer {
  constructor (
    container: HTMLElement,
    zIndex: number
  ) {
    super(container, zIndex);
  }

  render (rows: text.rows, rowIndex: number) {
    this.ctx.save();
    this.clear();
    const displayedRows = rows.slice(rowIndex);
    for (let i = 0; i < displayedRows.length; i++) {
      this.renderRow(displayedRows[i], i);
    }
    this.ctx.restore();
  }

  renderRow (row: text.row, index: number) {
    let xPosition: number = 4;
    const yPosition = index * 16 + 8;
    this.ctx.save();
    this.ctx.font = "16px Menlo";
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = "#fff";
    for (let t of row) {
      this.ctx.fillText(t.text, xPosition, yPosition);
      xPosition = xPosition + this.ctx.measureText(t.text).width;
    }
    this.ctx.restore();
  }
}

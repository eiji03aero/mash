import { text } from 'mash-common';
import { IConfig, IRenderPayload } from '../Types';
import { BaseRenderLayer } from './BaseRenderLayer';

export class TextRenderLayer extends BaseRenderLayer {
  constructor (
    container: HTMLElement,
    zIndex: number
  ) {
    super(container, zIndex);
  }

  render (params: IRenderPayload) {
    this.ctx.save();
    this.clear();
    const displayedRows = params.rows.slice(params.rowPosition);
    for (let i = 0; i < displayedRows.length; i++) {
      this.renderRow(displayedRows[i], i, params.config);
    }
    this.ctx.restore();
  }

  renderRow (row: text.row, index: number, config: IConfig) {
    let xPosition: number = 4;
    const yPosition = index * 16 + 8;
    this.ctx.save();
    this.ctx.font = `${config.fontSize}px ${config.fontFamily}`;
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = config.textWhite;
    for (let t of row) {
      this.ctx.fillText(t.text, xPosition, yPosition);
      xPosition = xPosition + this.ctx.measureText(t.text).width;
    }
    this.ctx.restore();
  }
}

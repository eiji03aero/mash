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
    for (let i = 0; i < params.displayedRows.length; i++) {
      this.renderRow(params.displayedRows[i], i, params.config);
    }
    this.ctx.restore();
  }

  renderRow (row: text.row, index: number, config: IConfig) {
    let xPosition: number = config.rowLeftMargin;
    const yPosition = index * config.fontSize + (index + 1) * config.rowTopMargin;
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

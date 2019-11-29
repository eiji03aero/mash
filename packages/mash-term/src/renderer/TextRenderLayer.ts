import { text } from 'mash-common';
import { IConfig, IRenderPayload, ITerminal } from '../types';
import { BaseRenderLayer } from './BaseRenderLayer';

export class TextRenderLayer extends BaseRenderLayer {
  constructor (
    terminal: ITerminal,
    zIndex: number
  ) {
    super(terminal, zIndex);
  }

  render (params: IRenderPayload) {
    this.ctx.save();
    this.clear();
    for (let i = 0; i < params.displayedRows.length; i++) {
      this.renderRow(params.displayedRows[i], i, params.config);
    }
    this.ctx.restore();
  }

  renderRow (row: text.Row, index: number, config: IConfig) {
    let xPosition: number = config.rowLeftMargin;
    const yPosition = (index + 1) * this.terminal.rowHeight - this.terminal.config.rowBottomMargin;
    this.ctx.save();
    this.setTextBaseStyle();
    this.ctx.fillStyle = config.textWhite;
    for (let t of row) {
      this.setTextColorFromObject(t);
      this.ctx.fillText(t.text, xPosition, yPosition);
      xPosition = xPosition + this.ctx.measureText(t.text).width;
    }
    this.ctx.restore();
  }
}

import { IConfig, IRenderPayload, ITerminal, IParsedRow } from "../types";
import { BaseRenderLayer } from "./BaseRenderLayer";

export class TextRenderLayer extends BaseRenderLayer {
  constructor (
    terminal: ITerminal,
    zIndex: number,
  ) {
    super(terminal, zIndex);
  }

  public render (params: IRenderPayload): void {
    this.ctx.save();
    this.clear();
    for (let i = 0; i < params.displayedRows.length; i++) {
      this.renderRow(params.displayedRows[i], i, params.config);
    }
    this.ctx.restore();
  }

  public renderRow (parsedRow: IParsedRow, index: number, config: IConfig): void {
    let xPosition: number = config.rowLeftMargin;
    const yPosition = (index + 1) * this.terminal.rowHeight - this.terminal.config.rowBottomMargin;
    this.ctx.save();
    this.setTextBaseStyle();
    this.ctx.fillStyle = config.textWhite;
    for (const t of parsedRow.row) {
      this.setTextColorFromObject(t);
      this.ctx.fillText(t.text, xPosition, yPosition);
      xPosition = xPosition + this.ctx.measureText(t.text).width;
    }
    this.ctx.restore();
  }
}

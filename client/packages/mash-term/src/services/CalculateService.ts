import { ICalculateService, ITerminal } from "../types";

export class CalculateService implements ICalculateService {
  private _canvas: HTMLCanvasElement;

  constructor (
    private _terminal: ITerminal,
  ) {
    this._canvas = document.createElement("canvas");
  }

  public get ctx (): CanvasRenderingContext2D {
    return this._canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  public measureText (text: string): TextMetrics {
    this.ctx.save();
    this.setTextBaseStyle();
    const metrics = this.ctx.measureText(text);
    this.ctx.restore();
    return metrics;
  }

  private setTextBaseStyle (): void {
    this.ctx.font = `${this._terminal.config.fontSize}px ${this._terminal.config.fontFamily}`;
    this.ctx.textBaseline = "alphabetic";
  }
}

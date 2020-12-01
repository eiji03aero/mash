import * as types from "../types";

export class TextMeasurer implements types.ITextMeasurer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor () {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
  }

  configure (config: types.Config): void {
    this.context.font = `${config.fontSize}px ${config.font}`;
  }

  measure (text: string): TextMetrics {
    return this.context.measureText(text);
  }
}

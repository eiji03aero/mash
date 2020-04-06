import { IRenderPayload, ITerminal } from "../types";
import { BaseRenderLayer } from "./BaseRenderLayer";

export class BackdropRenderLayer extends BaseRenderLayer {
  constructor (
    terminal: ITerminal,
    zIndex: number,
  ) {
    super(terminal, zIndex);
  }

  public render = (params: IRenderPayload) => {
    this.ctx.fillStyle = params.config.terminalBg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

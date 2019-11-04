import { IRenderPayload } from '../Types';
import { BaseRenderLayer } from './BaseRenderLayer';

export class BackdropRenderLayer extends BaseRenderLayer {
  constructor (
    container: HTMLElement,
    zIndex: number,
  ) {
    super(container, zIndex);
  }

  render = (params: IRenderPayload) => {
    this.ctx.fillStyle = params.config.terminalBg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

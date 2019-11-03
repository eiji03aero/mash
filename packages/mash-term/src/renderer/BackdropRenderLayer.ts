import { BaseRenderLayer } from './BaseRenderLayer';

export class BackdropRenderLayer extends BaseRenderLayer {
  constructor (
    container: HTMLElement,
    zIndex: number
  ) {
    super(container, zIndex);
    this.drawBackdrop();
  }

  resizeHook = () => {
    this.drawBackdrop();
  }

  drawBackdrop = () => {
    this.ctx.fillStyle = '#182F40';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

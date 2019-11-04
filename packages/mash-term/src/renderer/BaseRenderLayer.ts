import { IRenderPayload } from '../Types';

export class BaseRenderLayer {
  container: HTMLElement;
  canvas: HTMLCanvasElement;

  constructor (
    container: HTMLElement,
    zIndex: number
  ) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('style', `position: absolute; top: 0; bottom: 0; left: 0; right: 0; z-index: ${zIndex};`);
    this.container.appendChild(this.canvas);

    this.resizeCanvas();
  }

  public get ctx () {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public render (_: IRenderPayload) {
    return;
  }

  public resize (params: IRenderPayload) {
    this.resizeCanvas();
    this.render(params);
  }

  public clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private resizeCanvas = () => {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }
}

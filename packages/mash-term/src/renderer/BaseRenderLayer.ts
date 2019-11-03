import { text } from 'mash-common';

export class BaseRenderLayer {
  protected container: HTMLElement;
  protected canvas: HTMLCanvasElement;

  constructor (
    container: HTMLElement,
    zIndex: number
  ) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);

    this.canvas.setAttribute('style', `position: absolute; top: 0; bottom: 0; left: 0; right: 0; z-index: ${zIndex};`);

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas);
  }

  get ctx () {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  render (_: text.rows, _2: number) {
    return;
  }

  resizeCanvas = () => {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    this.resizeHook();
  }

  protected resizeHook () {
    return;
  }

  public clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

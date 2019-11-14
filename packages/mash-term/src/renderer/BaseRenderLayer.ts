import { IRenderPayload, IRectCoords, ITerminal } from '../Types';

export class BaseRenderLayer {
  terminal: ITerminal;
  canvas: HTMLCanvasElement;

  constructor (
    terminal: ITerminal,
    zIndex: number
  ) {
    this.terminal = terminal;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('style', `position: absolute; top: 0; bottom: 0; left: 0; right: 0; z-index: ${zIndex};`);
    this.terminal.container.appendChild(this.canvas);

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

  public clear (params?: IRectCoords) {
    const p = params || { x: 0, y: 0, width: this.canvas.offsetWidth, height: this.canvas.offsetHeight };

    this.ctx.clearRect(p.x, p.y, p.width, p.height);
  }

  protected setTextBaseStyle () {
    this.ctx.font = `${this.terminal.config.fontSize}px ${this.terminal.config.fontFamily}`;
    this.ctx.textBaseline = 'alphabetic';
  }

  private resizeCanvas = () => {
    this.canvas.width = this.terminal.container.offsetWidth;
    this.canvas.height = this.terminal.container.offsetHeight;
  }
}
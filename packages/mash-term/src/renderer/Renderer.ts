import { IRenderer, IBaseRenderLayer, IRenderPayload } from '../Types';
import { BackdropRenderLayer } from './BackdropRenderLayer';
import { TextRenderLayer } from './TextRenderLayer';

export class Renderer implements IRenderer {
  renderLayers: IBaseRenderLayer[];

  constructor (
    container: HTMLElement,
  ) {
    this.renderLayers = [
      new BackdropRenderLayer(container, 1),
      new TextRenderLayer(container, 2)
    ];
  }

  render (params: IRenderPayload) {
    for (let l of this.renderLayers) {
      l.render(params);
    }
  }

  resize (params: IRenderPayload) {
    for (let l of this.renderLayers) {
      l.resize(params);
    }
  }

  showCursor () {
  }

  hideCursor () {
  }
}

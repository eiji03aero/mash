import { IRenderer, IBaseRenderLayer, IRenderPayload, ITerminal } from '../Types';
import { BackdropRenderLayer } from './BackdropRenderLayer';
import { CursorRenderLayer } from './CursorRenderLayer';
import { TextRenderLayer } from './TextRenderLayer';

export class Renderer implements IRenderer {
  renderLayers: IBaseRenderLayer[];

  constructor (
    terminal: ITerminal
  ) {
    this.renderLayers = [
      new BackdropRenderLayer(terminal, 1),
      new TextRenderLayer(terminal, 2),
      new CursorRenderLayer(terminal, 3)
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
}

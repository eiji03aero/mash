import { text } from 'mash-common';
import { BaseRenderLayer } from './BaseRenderLayer';
import { BackdropRenderLayer } from './BackdropRenderLayer';
import { TextRenderLayer } from './TextRenderLayer';

export class Renderer {
  renderLayers: BaseRenderLayer[];

  constructor (
    container: HTMLElement
  ) {
    this.renderLayers = [
      new BackdropRenderLayer(container, 1),
      new TextRenderLayer(container, 2)
    ];
  }

  render (rows: text.rows, rowIndex: number) {
    for (let l of this.renderLayers) {
      l.render(rows, rowIndex);
    }
  }

  showCursor () {
  }

  hideCursor () {
  }
}

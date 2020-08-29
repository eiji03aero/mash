import {
  IBaseRenderLayer,
  ICursorRenderLayer,
  IRenderer,
  IRenderPayload,
  ITerminal
} from "../types";
import { BackdropRenderLayer } from "./BackdropRenderLayer";
import { CursorRenderLayer } from "./CursorRenderLayer";
import { TextRenderLayer } from "./TextRenderLayer";

export class Renderer implements IRenderer {
  renderLayers: IBaseRenderLayer[];

  constructor (
    terminal: ITerminal,
  ) {
    this.renderLayers = [
      new BackdropRenderLayer(terminal, 1),
      new TextRenderLayer(terminal, 2),
      new CursorRenderLayer(terminal, 3),
    ];
  }

  render (params: IRenderPayload): void {
    for (const l of this.renderLayers) {
      l.render(params);
    }
  }

  resize (params: IRenderPayload): void {
    for (const l of this.renderLayers) {
      l.resize(params);
    }
  }

  showCursor (): void {
    this._cursorRenderLayer.showCursor();
  }

  hideCursor (): void {
    this._cursorRenderLayer.hideCursor();
  }

  private get _cursorRenderLayer () { return this.renderLayers[2] as ICursorRenderLayer; }
}

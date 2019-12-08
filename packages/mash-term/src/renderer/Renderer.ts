import { IBaseRenderLayer, IRenderer, IRenderPayload, ITerminal } from "../types";
import { BackdropRenderLayer } from "./BackdropRenderLayer";
import { CursorRenderLayer } from "./CursorRenderLayer";
import { TextRenderLayer } from "./TextRenderLayer";

export class Renderer implements IRenderer {
  public renderLayers: IBaseRenderLayer[];

  constructor(
    terminal: ITerminal,
  ) {
    this.renderLayers = [
      new BackdropRenderLayer(terminal, 1),
      new TextRenderLayer(terminal, 2),
      new CursorRenderLayer(terminal, 3),
    ];
  }

  public render(params: IRenderPayload) {
    for (const l of this.renderLayers) {
      l.render(params);
    }
  }

  public resize(params: IRenderPayload) {
    for (const l of this.renderLayers) {
      l.resize(params);
    }
  }
}

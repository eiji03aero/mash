import { IRenderer, IBaseRenderLayer, IRenderPayload, ITerminal } from '../types';
export declare class Renderer implements IRenderer {
    renderLayers: IBaseRenderLayer[];
    constructor(terminal: ITerminal);
    render(params: IRenderPayload): void;
    resize(params: IRenderPayload): void;
}
//# sourceMappingURL=Renderer.d.ts.map
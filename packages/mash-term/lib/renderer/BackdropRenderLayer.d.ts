import { IRenderPayload, ITerminal } from '../types';
import { BaseRenderLayer } from './BaseRenderLayer';
export declare class BackdropRenderLayer extends BaseRenderLayer {
    constructor(terminal: ITerminal, zIndex: number);
    render: (params: IRenderPayload) => void;
}
//# sourceMappingURL=BackdropRenderLayer.d.ts.map
import { text } from 'mash-common';
import { IConfig, IRenderPayload, ITerminal } from '../types';
import { BaseRenderLayer } from './BaseRenderLayer';
export declare class TextRenderLayer extends BaseRenderLayer {
    constructor(terminal: ITerminal, zIndex: number);
    render(params: IRenderPayload): void;
    renderRow(row: text.Row, index: number, config: IConfig): void;
}
//# sourceMappingURL=TextRenderLayer.d.ts.map
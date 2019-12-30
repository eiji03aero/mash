import { IConfig, IRenderPayload, ITerminal, IParsedRow } from "../types";
import { BaseRenderLayer } from "./BaseRenderLayer";
export declare class TextRenderLayer extends BaseRenderLayer {
    constructor(terminal: ITerminal, zIndex: number);
    render(params: IRenderPayload): void;
    renderRow(parsedRow: IParsedRow, index: number, config: IConfig): void;
}
//# sourceMappingURL=TextRenderLayer.d.ts.map
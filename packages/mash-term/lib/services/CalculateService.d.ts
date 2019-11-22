import { ICalculateService, ITerminal } from '../types';
export declare class CalculateService implements ICalculateService {
    private _terminal;
    private _canvas;
    constructor(_terminal: ITerminal);
    get ctx(): CanvasRenderingContext2D;
    measureText(text: string): TextMetrics;
    private setTextBaseStyle;
}
//# sourceMappingURL=CalculateService.d.ts.map
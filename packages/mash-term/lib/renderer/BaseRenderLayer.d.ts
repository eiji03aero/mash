import { text } from "mash-common";
import { IRectCoords, IRenderPayload, ITerminal } from "../types";
export declare class BaseRenderLayer {
    terminal: ITerminal;
    canvas: HTMLCanvasElement;
    constructor(terminal: ITerminal, zIndex: number);
    get ctx(): CanvasRenderingContext2D;
    render(_: IRenderPayload): void;
    resize(params: IRenderPayload): void;
    clear(params?: IRectCoords): void;
    protected setTextBaseStyle(): void;
    protected setTextColorFromObject(t: text.ITextObject): void;
    private resizeCanvas;
}
//# sourceMappingURL=BaseRenderLayer.d.ts.map
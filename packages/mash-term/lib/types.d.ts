import { text } from 'mash-common';
export declare type KeyboardEventHandler = (e: KeyboardEvent) => void;
export interface IConfig {
    prompt: text.row;
    cursorInitialPauseMs: number;
    cursorIntervalMs: number;
    terminalBg: string;
    cursorBg: string;
    textWhite: string;
    textBlue: string;
    textYellow: string;
    fontFamily: string;
    fontSize: number;
    rowTopMargin: number;
    rowBottomMargin: number;
    rowLeftMargin: number;
    rowRightMargin: number;
}
export interface IRectCoords {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface IRenderPayload {
    rows: text.rows;
    displayedRows: text.rows;
    rowPosition: number;
    rowHeight: number;
    numberOfDisplayedRows: number;
    config: IConfig;
    textarea: HTMLTextAreaElement;
}
export interface ICalculateService {
    measureText(text: string): TextMetrics;
}
export interface IBaseRenderLayer {
    terminal: ITerminal;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    render(params: IRenderPayload): void;
    resize(params: IRenderPayload): void;
    clear(): void;
}
export interface IRenderer {
    renderLayers: IBaseRenderLayer[];
    render(params: IRenderPayload): void;
    resize(params: IRenderPayload): void;
}
export interface ITerminal {
    container: HTMLElement;
    renderer: IRenderer;
    textarea: HTMLTextAreaElement;
    config: IConfig;
    rows: text.rows;
    rowPosition: number;
    relativePromptRowPosition: number;
    rowHeight: number;
    isCursorShown: boolean;
    calculateService: ICalculateService;
    focus(): void;
    blur(): void;
    prompt(): void;
    writeln(texts: text.row): void;
    appendRow(texts: text.row): void;
    scroll(numberToScroll: number): void;
    scrollToBottom(): void;
}
//# sourceMappingURL=types.d.ts.map
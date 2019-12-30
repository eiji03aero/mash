import { Row } from "mash-common";
export declare type KeyboardEventHandler = (e: KeyboardEvent) => void;
export interface IConfig {
    prompt: string;
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
    rows: CachedRows;
    displayedRows: CachedRows;
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
export interface IWindowStat {
    width: number;
    height: number;
    availableWidth: number;
    availableHeight: number;
}
export interface IParsedRow {
    rowIndex: number;
    row: Row;
}
export declare type CachedRows = IParsedRow[];
export interface ITerminal {
    container: HTMLElement;
    renderer: IRenderer;
    textarea: HTMLTextAreaElement;
    config: IConfig;
    rows: string[];
    rowPosition: number;
    relativePromptRowPosition: number;
    rowHeight: number;
    isCursorShown: boolean;
    calculateService: ICalculateService;
    getWindowStat(): IWindowStat;
    measureText(str: string): TextMetrics;
    focus(): void;
    blur(): void;
    prompt(): void;
    clear(): void;
    writeln(str: string): void;
    appendRow(str: string): void;
    updateRowByIndex(index: number, str: string): void;
    scroll(numberToScroll: number): void;
    scrollToBottom(): void;
}
//# sourceMappingURL=types.d.ts.map
import { ICalculateService, IConfig, IRenderer, ITerminal, KeyboardEventHandler } from "./types";
export declare class Terminal implements ITerminal {
    container: HTMLElement;
    textarea: HTMLTextAreaElement;
    config: IConfig;
    rows: string[];
    rowPosition: number;
    isCursorShown: boolean;
    renderer: IRenderer;
    calculateService: ICalculateService;
    private _cachedRows;
    private _onKeyPressHandler;
    private _onContainerWheel;
    constructor(container: HTMLElement, cfg?: any);
    get relativePromptRowPosition(): number;
    get rowHeight(): number;
    getWindowStat(): {
        width: number;
        height: number;
        availableWidth: number;
        availableHeight: number;
    };
    measureText(str: string): TextMetrics;
    focus(): void;
    blur(): void;
    prompt(): void;
    clear(): void;
    writeln(str: string): void;
    appendRow(str: string): void;
    updateRowByIndex(idx: number, str: string): void;
    scroll(numberToScroll: number): void;
    scrollToBottom(): void;
    onKeyPress(fn: KeyboardEventHandler): void;
    private get _renderPayload();
    private get _bottomPosition();
    private get _numberOfDisplayedRows();
    private get _isOnBottom();
    private _render;
    private _updateCachedRows;
    private _splitRowWithLimit;
    private _onDocumentClick;
    private _onResize;
    private _onKeyPress;
    private _onKeyUp;
}
//# sourceMappingURL=Terminal.d.ts.map
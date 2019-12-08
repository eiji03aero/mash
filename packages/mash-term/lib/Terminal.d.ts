import { text } from "mash-common";
import { ICalculateService, IConfig, IRenderer, ITerminal, KeyboardEventHandler } from "./types";
export declare class Terminal implements ITerminal {
    get relativePromptRowPosition(): number;
    get rowHeight(): number;
    private get _renderPayload();
    private get _bottomPosition();
    private get _numberOfDisplayedRows();
    private get _isOnBottom();
    container: HTMLElement;
    textarea: HTMLTextAreaElement;
    config: IConfig;
    rows: text.Rows;
    rowPosition: number;
    isCursorShown: boolean;
    renderer: IRenderer;
    calculateService: ICalculateService;
    private _cachedRows;
    private _onKeyPressHandler;
    private _onContainerWheel;
    constructor(container: HTMLElement, config: any);
    focus(): void;
    blur(): void;
    prompt(): void;
    writeln(texts: text.Row): void;
    appendRow(texts: text.Row): void;
    scroll(numberToScroll: number): void;
    scrollToBottom(): void;
    onKeyPress(fn: KeyboardEventHandler): void;
    private _render;
    private _updateCachedRows;
    private _splitRowWithLimit;
    private _onDocumentClick;
    private _onResize;
    private _onKeyPress;
    private _onKeyUp;
}
//# sourceMappingURL=Terminal.d.ts.map
import { text } from 'mash-common';
import { KeyboardEventHandler, ITerminal, IRenderer, IConfig, ICalculateService } from './types';
export declare class Terminal implements ITerminal {
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
    constructor(container: HTMLElement, config: any);
    get relativePromptRowPosition(): number;
    get rowHeight(): number;
    focus(): void;
    blur(): void;
    prompt(): void;
    writeln(texts: text.Row): void;
    appendRow(texts: text.Row): void;
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
    private _onContainerWheel;
    private _onKeyPress;
    private _onKeyUp;
}
//# sourceMappingURL=Terminal.d.ts.map
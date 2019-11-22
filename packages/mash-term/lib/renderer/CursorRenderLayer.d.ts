import { IRenderPayload, ITerminal } from '../types';
import { BaseRenderLayer } from './BaseRenderLayer';
export declare class CursorRenderLayer extends BaseRenderLayer {
    private _blinkTimeoutIds;
    private _blinkIntervalIds;
    private _isCursorShown;
    constructor(terminal: ITerminal, zIndex: number);
    render: (_: IRenderPayload) => void;
    private _clearIntervals;
    private _beginBlinkCursor;
    private _showBlockCursor;
    private get _cursorChar();
    private get _cursorX();
    private get _cursorY();
    private get _cursorCharWidth();
    private get _cursorCharHeight();
}
//# sourceMappingURL=CursorRenderLayer.d.ts.map
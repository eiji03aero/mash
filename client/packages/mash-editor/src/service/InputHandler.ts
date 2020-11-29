import * as mfs from "mash-filesystem";

import * as types from "../types";
import * as dmn from "../domain";

export class InputHandler implements types.IInputHandler {
  service: types.IService;
  combination: string | null;
  timerIds: {
    changingWindow: number;
    combination: number;
  };

  constructor (params: {
    service: types.IService,
  }) {
    this.service = params.service;
    this.combination = null;
    this.timerIds = {
      changingWindow: 0,
      combination: 0,
    };
  }

  handleKeyDown (event: KeyboardEvent): void {
    if (this.handleMoveWindowFocus({
      event,
    })) {
      return;
    }

    const { bufferWindow, buffer } = this.service.getCurrentBufferWindowSet();
    const stats = this.service.getWindowStats({
      bufferWindowId: bufferWindow.id,
      bufferId: buffer.id,
    });

    if (this.handleWindowScroll({
      event,
      bufferWindow,
      buffer,
      stats,
    })) {
      return;
    }
  }

  handleKeyPress (event: KeyboardEvent): void {
    const { bufferWindow, buffer } = this.service.getCurrentBufferWindowSet();
    const stats = this.service.getWindowStats({
      bufferWindowId: bufferWindow.id,
      bufferId: buffer.id,
    });

    if (this.handleWindowOperation({
      event,
      bufferWindow,
      buffer,
      stats,
    })) {
      return;
    }

    if (dmn.utils.isBuffer(buffer)) {
      this.handleBuffer({
        event,
        buffer,
        bufferWindow,
        stats,
      });
    }
    else if (dmn.utils.isFiler(buffer)) {
      this.handleFiler({
        event,
        filer: buffer,
        bufferWindow,
        stats,
      });
    }
  }

  private handleMoveWindowFocus (params: {
    event: KeyboardEvent;
  }): boolean {
    const { event } = params;

    if (event.ctrlKey && event.key === "w") {
      if (this.service.state.ui.changingWindow) {
        return true;
      }

      this.timerIds.changingWindow = window.setTimeout(() => {
        this.service.setState({
          ui: {
            changingWindow: false,
          },
        });
      }, 500);
      this.service.setState({
        ui: {
          changingWindow: true,
        }
      });
      return true;
    }

    if (this.service.state.ui.changingWindow) {
      const nextWindowId =
        event.key === "h" ? this.service.state.windows[0].id :
        event.key === "l" ? this.service.state.windows[1].id :
        this.service.state.currentWindowId;
      window.clearTimeout(this.timerIds.changingWindow);
      this.service.setState({
        currentWindowId: nextWindowId,
        ui: {
          changingWindow: false,
        }
      });
      return true;
    }

    return false;
  }

  private handleWindowScroll (params: {
    event: KeyboardEvent;
    bufferWindow: types.IBufferWindow;
    buffer: types.IBufferKind;
    stats: types.BufferWindowStats;
  }): boolean {
    const { event, buffer, stats } = params;
    let updated = false;

    if (event.ctrlKey && event.key === "d") {
      buffer.scroll(Math.floor(stats.displayLines / 2), stats);
      updated = true;
    }
    else if (event.ctrlKey && event.key === "u") {
      buffer.scroll(-1 * Math.floor(stats.displayLines / 2), stats);
      updated = true;
    }

    if (updated) {
      this.service.updateBuffer(buffer);
    }

    return updated;
  }

  private handleWindowOperation (params: {
    event: KeyboardEvent;
    bufferWindow: types.IBufferWindow;
    buffer: types.IBufferKind;
    stats: types.BufferWindowStats;
  }): boolean {
    const { event, buffer, stats } = params;
    let updated = false;

    if (event.key === "g") {
      if (this.combination === "g") {
        buffer.scroll(-1 * stats.lines, stats);
        window.clearTimeout(this.timerIds.combination);
        this.combination = null;
        updated = true;
      }
      else {
        this.combination = "g";
        this.timerIds.combination = window.setTimeout(() => {
          this.combination = null;
        }, 2000);
        updated = true;
      }
    }
    else if (event.key === "G") {
      buffer.scroll(stats.lines, stats);
    }

    if (updated) {
      this.service.updateBuffer(buffer);
    }

    return updated;
  }

  private handleBuffer (params: {
    event: KeyboardEvent;
    buffer: types.IBuffer;
    bufferWindow: types.IBufferWindow;
    stats: types.BufferWindowStats;
  }): void {
    const { event, buffer, stats } = params;

    if (event.key === "j") {
      buffer.scroll(1, stats);
    }
    else if (event.key === "k") {
      buffer.scroll(-1, stats);
    }
    else if (event.key === "Enter") {
      buffer.scroll(1, stats);
    }
    else if (event.key === "x") {
      // TBD
      return;
    }

    this.service.updateBuffer(buffer);
  }

  private handleFiler (params: {
    event: KeyboardEvent;
    filer: types.IFiler;
    bufferWindow: types.IBufferWindow;
    stats: types.BufferWindowStats;
  }): void {
    const { event, filer, stats } = params;
    const s = filer.serialize();

    const rows = this.service.getFilerRows(filer.id);
    const idx = s.scrollLine + s.cursorLine;
    const node = rows[idx].node;

    if (event.key === "j") {
      filer.scroll(1, stats);
    }
    else if (event.key === "k") {
      filer.scroll(-1, stats);
    }
    else if (event.key === "Enter" || event.key === "o") {
      if (mfs.utils.isFile(node)) {
        this.service.openBuffer(node.id);
      }
      else if (mfs.utils.isDirectory(node)) {
        filer.toggleOpenedNode(node.id);
      }
    }
    else if (event.key === "x") {
      filer.closeNode(node.parentNodeId);
      filer.scrollTo(rows.findIndex((r) => r.node.id === node.parentNodeId), stats);
    }

    this.service.updateBuffer(filer);
  }
}

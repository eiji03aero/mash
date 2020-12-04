import * as mfs from "mash-filesystem";

import * as types from "../types";
import * as dmn from "../domain";
import { BufferScroller } from "./BufferScroller";

const combo = {
  ctrlw: "Ctrl w",
};

type TimerIds = {
  combination: number;
};

export class InputHandler implements types.IInputHandler {
  service: types.IService;

  combination: string | null;
  timerIds: TimerIds;

  constructor (params: {
    service: types.IService,
  }) {
    this.service = params.service;
    this.combination = null;
    this.timerIds = {
      combination: 0,
    };
  }

  handleKeyDown (event: KeyboardEvent): void {
    if (this.handleMoveWindowFocus({
      event,
    })) {
      event.preventDefault();
      return;
    }

    const { bufferWindow, buffer } = this.service.getCurrentBufferWindowSet();
    const scroller = new BufferScroller({
      service: this.service,
      bufferWindow,
      buffer,
    });
    const stats = this.service.getWindowStats({
      bufferWindowId: bufferWindow.id,
      bufferId: buffer.id,
    });

    if (this.handleWindowScrollCommand({
      event,
      buffer,
      scroller,
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
    const scroller = new BufferScroller({
      service: this.service,
      bufferWindow,
      buffer,
    });

    if (this.handleWindowOperation({
      event,
      buffer,
      scroller,
      stats,
    })) {
      return;
    }

    if (this.handleCursorCommand({
      event,
      buffer,
      scroller,
    })) {
      return;
    }

    if (dmn.utils.isBuffer(buffer)) {
      this.handleBuffer({
        event,
        buffer,
        scroller,
        stats,
      });
    }
    else if (dmn.utils.isFiler(buffer)) {
      this.handleFiler({
        event,
        filer: buffer,
        scroller,
        stats,
      });
    }
  }

  private handleMoveWindowFocus (params: {
    event: KeyboardEvent;
  }): boolean {
    const { event } = params;

    if (event.ctrlKey && event.key === "w") {
      this.combination = combo.ctrlw;
      this.startCombination();
      return true;
    }

    if (this.combination === combo.ctrlw) {
      const nextWindowId =
        event.key === "h" ? this.service.state.windows[0].id :
        event.key === "l" ? this.service.state.windows[1].id :
        this.service.state.currentWindowId;
      this.cancelCombination();
      this.service.setState({
        currentWindowId: nextWindowId,
      });
      return true;
    }

    return false;
  }

  private handleWindowScrollCommand (params: {
    event: KeyboardEvent;
    buffer: types.IBufferKind;
    scroller: types.IBufferScroller;
    stats: types.BufferWindowStats;
  }): boolean {
    const { event, buffer, stats, scroller } = params;
    let updated = false;

    if (event.ctrlKey && event.key === "d") {
      scroller.scroll(Math.floor(stats.maxDisplayLines / 2));
      updated = true;
    }
    else if (event.ctrlKey && event.key === "u") {
      scroller.scroll(-1 * Math.floor(stats.maxDisplayLines / 2));
      updated = true;
    }

    if (updated) {
      this.service.updateBuffer(buffer);
    }

    return updated;
  }

  private handleCursorCommand (params: {
    event: KeyboardEvent;
    buffer: types.IBufferKind;
    scroller: types.IBufferScroller;
  }): boolean {
    const { scroller, buffer, event } = params;
    let updated = false;

    if (event.key === "j") {
      scroller.scroll(1);
      updated = true;
    }
    else if (event.key === "k") {
      scroller.scroll(-1);
      updated = true;
    }
    else if (event.key === "h") {
      scroller.slideCursor(-1);
      updated = true;
    }
    else if (event.key === "l") {
      scroller.slideCursor(1);
      updated = true;
    }
    else if (event.key === "w") {
      scroller.slideCursorToNextWordBegin();
      updated = true;
    }
    else if (event.key === "b") {
      scroller.slideCursorToPreviousWordBegin();
      updated = true;
    }
    else if (event.key === "e") {
      scroller.slideCursorToNextWordEnd();
      updated = true;
    }

    if (updated) {
      this.service.updateBuffer(buffer);
    }

    return updated;
  }

  private handleWindowOperation (params: {
    event: KeyboardEvent;
    buffer: types.IBufferKind;
    scroller: types.IBufferScroller;
    stats: types.BufferWindowStats;
  }): boolean {
    const { event, buffer, scroller, stats } = params;
    let updated = false;

    if (event.key === "g") {
      if (this.combination === "g") {
        scroller.scroll(-1 * stats.lines);
        this.cancelCombination();
        updated = true;
      }
      else {
        this.combination = "g";
        this.startCombination();
        updated = true;
      }
    }
    else if (event.key === "G") {
      scroller.scroll(stats.lines);
      updated = true;
    }

    if (updated) {
      this.service.updateBuffer(buffer);
    }

    return updated;
  }

  private handleBuffer (params: {
    event: KeyboardEvent;
    buffer: types.IBuffer;
    scroller: types.IBufferScroller;
    stats: types.BufferWindowStats;
  }): void {
    const { event, buffer, scroller } = params;

    if (event.key === "Enter") {
      scroller.scroll(1);
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
    scroller: types.IBufferScroller;
    stats: types.BufferWindowStats;
  }): void {
    const { event, filer, scroller } = params;

    const rows = this.service.getFilerRows(filer.id);
    const idx = filer.scrollLine + filer.cursorLine;
    const node = rows[idx].node;

    if (event.key === "Enter" || event.key === "o") {
      if (mfs.utils.isFile(node)) {
        this.service.openBuffer(node.id);
      }
      else if (mfs.utils.isDirectory(node)) {
        filer.toggleOpenedNode(node.id);
      }
    }
    else if (event.key === "x") {
      filer.closeNode(node.parentNodeId);
      scroller.scrollTo(rows.findIndex((r) => r.node.id === node.parentNodeId));
    }

    this.service.updateBuffer(filer);
  }

  private startCombination () {
    window.clearTimeout(this.timerIds.combination);
    this.timerIds.combination = window.setTimeout(() => {
      this.combination = null;
    }, 1000);
  }

  private cancelCombination () {
    window.clearTimeout(this.timerIds.combination);
    this.combination = null;
  }
}

import * as mfs from "mash-filesystem";
import * as mc from "mash-common";

import * as types from "../types";
import * as dmn from "../domain";
import { BufferScroller } from "./BufferScroller";

const combo = {
  ctrlw: "Ctrl w",
  ctrln: "Ctrl n",
};

type TimerIds = {
  combination: number;
};

export class InputHandler implements types.IInputHandler {
  service: types.IService;

  combination: string | null;
  timerIds: TimerIds;
  filerOperation: "menu" | "create" | "move" | "delete" | null;

  constructor (params: {
    service: types.IService,
  }) {
    this.service = params.service;
    this.combination = null;
    this.timerIds = {
      combination: 0,
    };
    this.filerOperation = null;
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

    if (event.ctrlKey && event.key === "n") {
      this.startCombination(combo.ctrln);
      return;
    }

    if (this.isCancel(event)) {
      this.service.setState({
        focusTarget: "windows",
        infoText: "",
      });
      this.service.updateTextarea({
        value: "",
      });
      setTimeout(() => {
        this.service.focus();
      }, 50);
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

    if (this.service.state.focusTarget === "commandLine" && this.filerOperation === null) {
      if (event.key === "Enter") {
        event.preventDefault();
        const buffer = this.service.getCommandLineBuffer();
        this.service.executeExCommand(buffer.content);
        this.service.setState({
          focusTarget: "windows",
        });
      }

      return;
    }

    if (event.key === ":") {
      event.preventDefault();
      this.service.setState({
        focusTarget: "commandLine",
      });
      this.service.updateTextarea({
        value: ":",
      });
      return;
    }

    if (this.combination === combo.ctrln) {
      if (event.key === "t") {
        this.service.toggleFiler();
        this.cancelCombination();
        return;
      }
    }

    if (this.handleWindowOperation({
      event,
      buffer,
      scroller,
      stats,
    })) {
      return;
    }

    if (this.filerOperation === null && this.handleCursorCommand({
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
      this.startCombination(combo.ctrlw);
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
        this.startCombination("g");
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

    if (this.handleFilerOperation({
      event,
      filer,
      rows,
    })) {
      return;
    }

    if (this.filerOperation !== null) {
      return;
    }

    if (event.key === "Enter" || event.key === "o") {
      if (mfs.utils.isFile(node)) {
        this.service.openBufferByNodeId(node.id);
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

  private handleFilerOperation (params: {
    event: KeyboardEvent;
    filer: types.IFiler;
    rows: types.FilerRow[];
  }): boolean {
    const { filer, event, rows } = params;
    const cursorNodeId = rows[filer.cursorLine]?.node?.id || filer.nodeId;
    const cursorNode = this.service.getNode(cursorNodeId);
    let updated = false;

    const cleanup = () => {
      this.filerOperation = null;
      this.service.setState({
        focusTarget: "windows",
        infoText: "",
      });
    };

    if (this.filerOperation === null && event.key === "m") {
      this.service.setInfoText([
        "Filer operation:",
        "a) Create file/directory",
        "d) Delete file/directory",
        "m) Move file/directory",
      ].join("\n"));
      this.filerOperation = "menu";
      updated = true;
    }
    else if (this.filerOperation === "menu") {
      const path = this.service.getAbsolutePath(cursorNodeId);
      const inspected = mc.paths.inspect(path);
      if (event.key === "a") {
        event.preventDefault();
        this.filerOperation = "create";
        this.service.setInfoText([
          "Create node:",
          "Press enter to complete creation."
        ].join("\n"));
        const value = mfs.utils.isFile(cursorNode)
          ? `${inspected.dirname}${inspected.dirname.length === 1 ? "" : "/"}`
          : path
        this.service.updateTextarea({
          value: value
        });
        this.service.setState({ focusTarget: "commandLine" });
        updated = true;
      }
      else if (event.key === "m") {
        event.preventDefault();
        this.filerOperation = "move";
        this.service.setInfoText([
          "Move node:",
          "Press enter to complete move."
        ].join("\n"));
        this.service.updateTextarea({
          value: path,
        });
        this.service.setState({ focusTarget: "commandLine" });
        updated = true;
      }
      else if (event.key === "d") {
        event.preventDefault();
        this.filerOperation = "delete";
        this.service.setInfoText([
          "Delete node:",
          "Press y if you are sure to delete this node:",
          path,
        ].join("\n"));
        this.service.updateTextarea({
          value: "",
        });
        this.service.setState({ focusTarget: "commandLine" });
        updated = true;
      }
      else {
        this.filerOperation = null;
        this.service.setState({ infoText: "" });
      }
      updated = true;
    }
    else if (event.key === "Enter") {
      event.preventDefault();
      const path = this.service.handlerTextarea.value;
      if (this.filerOperation === "create") {
        this.service.filesystem.createNodeByPath(path)
          .catch(this.service.error)
          .then(cleanup);
        updated = true;
      }
      else if (this.filerOperation === "move") {
        console.log(path, cursorNodeId);
        this.service.filesystem.moveNodeByPath({
          nodeId: cursorNodeId,
          path: path,
        })
          .catch(this.service.error)
          .then(cleanup);
        updated = true;
      }
      this.filerOperation = null;
    }
    else if (this.filerOperation === "delete") {
      if (event.key === "y") {
        event.preventDefault();
        const path = this.service.getAbsolutePath(cursorNodeId);
        this.service.ensureBufferCursorLine(filer, -1);
        this.service.updateBuffer(filer);
        this.service.filesystem.deleteNodeByPath(path)
          .catch(this.service.error)
          .then(cleanup);
        updated = true;
      } else {
        cleanup();
        updated = true;
      }
    }

    return updated;
  }

  private startCombination (combi: string) {
    this.combination = combi;
    window.clearTimeout(this.timerIds.combination);
    this.timerIds.combination = window.setTimeout(() => {
      this.combination = null;
    }, 1000);
  }

  private cancelCombination () {
    window.clearTimeout(this.timerIds.combination);
    this.combination = null;
  }

  private isCancel (event: KeyboardEvent) {
    return (
      (event.ctrlKey && event.key === "c")
      || (event.key === "Escape")
    );
  }
}

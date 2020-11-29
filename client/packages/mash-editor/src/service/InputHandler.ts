import * as mfs from "mash-filesystem";

import * as types from "../types";
import * as dmn from "../domain";

export class InputHandler implements types.IInputHandler {
  service: types.IService;
  timerIds: {
    changingWindow: number;
  };

  constructor (params: {
    service: types.IService,
  }) {
    this.service = params.service;
    this.timerIds = {
      changingWindow: 0,
    };
  }

  handleKey (params: {
    key: string;
    ctrlKey: boolean;
  }): void {
    if (params.ctrlKey && params.key === "w") {
      if (this.service.state.ui.changingWindow) {
        return;
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
      return;
    }

    if (this.service.state.ui.changingWindow) {
      const nextWindowId =
        params.key === "h" ? this.service.state.windows[0].id :
        params.key === "l" ? this.service.state.windows[1].id :
        this.service.state.currentWindowId;
      window.clearTimeout(this.timerIds.changingWindow);
      this.service.setState({
        currentWindowId: nextWindowId,
        ui: {
          changingWindow: false,
        }
      });
      return;
    }

    const { bufferWindow, buffer } = this.service.getCurrentBufferWindowSet();
    const stats = this.service.getWindowStats({
      bufferWindowId: bufferWindow.id,
      bufferId: buffer.id,
    });

    if (dmn.utils.isBuffer(buffer)) {
      this.handleBuffer({
        key: params.key,
        buffer,
        stats,
      });
    }
    else if (dmn.utils.isFiler(buffer)) {
      this.handleFiler({
        key: params.key,
        filer: buffer,
        stats,
      });
    }

    this.service.setState({
      windows: this.service.updateWindows(bufferWindow),
      buffers: this.service.updateBuffers(buffer),
    });
  }

  private handleBuffer (params: {
    key: string;
    buffer: types.IBuffer;
    stats: types.BufferWindowStats;
  }): void {
    const { key, buffer, stats } = params;

    if (key === "j") {
      buffer.scroll(1, stats);
    }
    else if (key === "k") {
      buffer.scroll(-1, stats);
    }
    else if (key === "Enter") {
      buffer.scroll(1, stats);
    }
    else if (key === "x") {
      // TBD
      return;
    }
  }

  private handleFiler (params: {
    key: string;
    filer: types.IFiler;
    stats: types.BufferWindowStats;
  }): void {
    const { key, filer, stats } = params;
    const s = filer.serialize();

    const rows = this.service.getFilerRows(filer.id);
    const idx = s.scrollLine + s.cursorLine;
    const node = rows[idx].node;

    if (key === "j") {
      filer.scroll(1, stats);
    }
    else if (key === "k") {
      filer.scroll(-1, stats);
    }
    else if (key === "Enter") {
      if (mfs.utils.isFile(node)) {
        this.service.openBuffer(node.id);
      }
      else if (mfs.utils.isDirectory(node)) {
        filer.toggleOpenedNode(node.id);
      }
    }
    else if (key === "x") {
      filer.closeNode(node.parentNodeId);
      filer.scrollTo(rows.findIndex((r) => r.node.id === node.parentNodeId), stats);
    }
  }
}

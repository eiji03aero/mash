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

  handleKey (state: types.AS, params: {
    key: string;
    ctrlKey: boolean;
  }): types.ASHandlerResult {
    if (params.ctrlKey && params.key === "w") {
      if (state.ui.changingWindow) {
        return;
      }

      this.timerIds.changingWindow = window.setTimeout(() => {
        this.service.requestAction({
          type: "setUIState",
          ui: {
            changingWindow: false,
          },
        });
      }, 500);
      return this.service.mergeState(state, {
        ui: {
          changingWindow: true,
        }
      });
    }

    if (state.ui.changingWindow) {
      const nextWindowId =
        params.key === "h" ? state.windows[0].id :
        params.key === "l" ? state.windows[1].id :
        state.currentWindowId;
      window.clearTimeout(this.timerIds.changingWindow);
      return this.service.mergeState(state, {
        currentWindowId: nextWindowId,
        ui: {
          changingWindow: false,
        }
      });
    }

    const { bufferWindow, buffer } = this.service.getCurrentBufferWindowSet(state);
    const stats = this.service.getWindowStats({
      config: state.config,
      bufferWindow,
      buffer,
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


    return this.service.mergeState(state, {
      windows: this.service.updateWindows(state.windows, bufferWindow),
      buffers: this.service.updateBuffers(state.buffers, buffer),
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

    const rows = this.service.getFilerRows(s);
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
        this.service.requestAction({
          type: "openBuffer",
          nodeId: node.id,
        });
        return;
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

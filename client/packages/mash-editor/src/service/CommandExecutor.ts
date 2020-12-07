import * as E from "fp-ts/es6/Either";
import * as types from "../types";
import * as asts from "../assets";
import * as dmn from "../domain";

type ParsedCommand = {
  command: string;
  args: string[];
};

const commands = {
  edit: ["e", "edit"],
  help: ["h", "help"],
  quit: ["q", "quit"],
  write: ["w", "write"],
};

export class CommandExecutor implements types.ICommandExecutor {
  service: types.IService;

  constructor (params: {
    service: types.IService;
  }) {
    this.service = params.service;
  }

  execute (c: string): void {
    const { command, args } = this.parse(c);

    if (commands.help.includes(command)) {
      this.service.openBuffer(asts.prebfs.help.id);
    }
    else if (commands.quit.includes(command)) {
      this.service.requestAction({
        type: "quit",
      });
    }
    else if (commands.edit.includes(command)) {
      if (args.length < 1) {
        throw this.service.error("not enough arguments. :edit [path]");
      }
      const node = this.service.getNodeByPath(args[0]);
      this.service.openBufferByNodeId(node.id);
    }
    else if (commands.write.includes(command)) {
      const { buffer } = this.service.getCurrentBufferWindowSet();
      if (!dmn.utils.isBuffer(buffer)) {
        this.service.error("only buffer can be written");
        return;
      }

      this.service.filesystem.updateFile({
        id: buffer.nodeId,
        params: {
          content: buffer.content,
        }
      })
        .then((res) => {
          if (E.isLeft(res)) {
            throw res.left;
          }
          const r = this.service.filesystem.resolveAbsolutePath(buffer.nodeId);
          if (E.isLeft(r)) {
            throw r.left;
          }
          this.service.setInfoText(`"${r.right}" written`);
        })
        .catch(this.service.error);
    }

    else if (command === "FilerToggle") {
      this.service.toggleFiler();
    }
  }

  private parse (c: string): ParsedCommand {
    const cmdSplit = c.slice(1, c.length).split(" ");
    if (cmdSplit.length === 0) {
      throw this.service.error(`invalid command: ${c}`);
    }

    return {
      command: cmdSplit[0],
      args: cmdSplit.slice(1, cmdSplit.length),
    };
  }
}

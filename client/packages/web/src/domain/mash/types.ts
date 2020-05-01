import {
  IContext as MIContext,
  ICommandPayload,
  ICommandMap,
} from "mash";
import { IFileSystem } from "mash-filesystem";
import { ITerminal } from "mash-term";

import { IService } from "../../types";

export interface IContext extends MIContext {
  filesystem: IFileSystem;
  terminal: ITerminal;
  service: IService;
  read(promptStr: string): Promise<string>;
}

export type CommandPayload = ICommandPayload<IContext>;
export type CommandMap = ICommandMap<IContext>;

import { IContext as MIContext } from "mash";
import { IFileSystem } from "mash-filesystem";

export interface IContext extends MIContext {
  filesystem: IFileSystem;
}

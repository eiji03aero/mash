import {
  IService,
  IMash,
  IProxy,
} from "../types";
import { Mash } from "../domain/mash";

export class Service implements IService {
  private _mash: IMash;
  private _proxy: IProxy;

  constructor (params: {
    proxy: IProxy;
  }) {
    this._proxy = params.proxy;
    this._mash = null as any;
  }

  initialize (params: {
    terminalContainer: HTMLElement;
  }) {
    this._mash = new Mash({
      proxy: this._proxy,
      terminalContainer: params.terminalContainer,
    });
    this._mash.initialize();
  }
}

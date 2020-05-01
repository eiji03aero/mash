import * as E from "fp-ts/lib/Either";

import {
  IService,
  IMash,
  IProxy,
} from "../types";
import { Mash } from "../domain/mash";
import * as session from "../adapters/session";

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
      terminalContainer: params.terminalContainer,
      service: this,
    });
    this._mash.initialize();
  }

  // -------------------- Proxy --------------------
  async signup (params: {
    name: string;
    password: string;
  }): Promise<E.Either<Error, null>> {
    return this._proxy.signup(params);
  }

  async login (params: {
    name: string;
    password: string;
  }): Promise<E.Either<Error, string>> {
    const r1 = await this._proxy.login(params);
    if (E.isLeft(r1)) {
      return r1;
    }

    session.setToken(r1.right);
    return r1;
  }

  async logout (): Promise<E.Either<Error, null>> {
    const r1 = await this._proxy.logout();
    if (E.isLeft(r1)) {
      return r1;
    }

    session.clearToken();
    return r1;
  }
}

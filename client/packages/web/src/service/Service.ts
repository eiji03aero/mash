import * as E from "fp-ts/lib/Either";
import * as me from "mash-editor";
import * as mfs from "mash-filesystem";

import * as types from "../types";
import { Mash } from "../domain/mash";
import { gen } from "../graphql";
import * as utils from "../utils";

export class Service implements types.IService {
  editorEngine: me.EditorEngine;
  private _mash: types.IMash;
  private _authRepository: types.IAuthRepository;
  private _localStateRepository: types.ILocalStateRepository;
  private _localStore: types.ILocalStore;

  constructor (params: {
    localStore: types.ILocalStore;
    authRepository: types.IAuthRepository;
    localStateRepository: types.ILocalStateRepository;
  }) {
    this.editorEngine = null as any;
    this._localStore = params.localStore;
    this._localStateRepository = params.localStateRepository;
    this._authRepository = params.authRepository;
    this._mash = null as any;
  }

  async initialize (params: {
    terminalContainer: HTMLElement;
  }): Promise<void> {
    this._localStateRepository.update({
      applicationState: gen.ApplicationState.Booting,
    });
    await utils.sleep(4000);

    this._localStateRepository.update({
      applicationState: gen.ApplicationState.Running,
    });
    await utils.sleep(500);

    const filesystem = mfs.FileSystem.bootstrap();

    this._mash = new Mash({
      terminalContainer: params.terminalContainer,
      service: this,
      filesystem,
      localStateRepository: this._localStateRepository,
    });
    this._mash.initialize();

    this.editorEngine = new me.EditorEngine({
      filesystem,
    });
  }

  // -------------------- auth --------------------
  get isLoggedIn (): boolean {
    const r = this._localStore.getToken()
    return E.isRight(r);
  }

  async signup (params: {
    name: string;
    password: string;
  }): Promise<E.Either<Error, null>> {
    return this._authRepository.signup(params);
  }

  async login (params: {
    name: string;
    password: string;
  }): Promise<E.Either<Error, string>> {
    const r1 = await this._authRepository.login(params);
    if (E.isLeft(r1)) {
      return r1;
    }

    this._localStore.saveToken(r1.right);
    await this._localStateRepository.update({
      username: params.name
    });
    return r1;
  }

  async logout (): Promise<E.Either<Error, null>> {
    const r1 = await this._authRepository.logout();
    if (E.isLeft(r1)) {
      return r1;
    }

    this._localStore.clearToken();
    await this._localStateRepository.update({
      username: "guest",
    });
    return r1;
  }

  // -------------------- mash --------------------
  focusTerminal (): void {
    this._mash.focusTerminal();
  }

  blurTerminal (): void {
    this._mash.blurTerminal();
  }

  // -------------------- editor --------------------
  async openEditor (): types.PromisedEither<null> {
    await this._localStateRepository.update({
      editorState: gen.EditorState.Running,
    });
    return E.right(null);
  }

  async closeEditor (): types.PromisedEither<null> {
    await this._localStateRepository.update({
      editorState: gen.EditorState.Stopped,
    });
    return E.right(null);
  }
}

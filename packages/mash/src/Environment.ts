import {
  IEnvironment,
  IStore
} from './types';

export class Environment implements IEnvironment {
  private _store: IStore;

  constructor () {
    this._store = {} as IStore;
  }

  get (name: string): any {
    return this._store[name];
  }

  set (name: string, value: any) {
    this._store[name] = value;
  }
}

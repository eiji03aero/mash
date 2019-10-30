export class Env {
  private store: object;

  constructor () {
    this.store = {};
  }

  get (name: string): any {
    return this.store[name];
  }

  set (name: string, value: any) {
    this.store[name] = value;
  }
}

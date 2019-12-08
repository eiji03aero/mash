import { date } from "../";

export interface IBaseBasis {
  _?: any;
}

export class Base {
  public createdAt: string;

  constructor() {
    this.createdAt = date.getCurrentTime();
  }

  public message(): string {
    return this.createdAt;
  }
}

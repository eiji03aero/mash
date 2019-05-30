import { date } from "../";

export interface BaseBasis { }

export class Base {
  createdAt: string;

  constructor () {
    this.createdAt = date.getCurrentTime();
  }

  message (): string {
    return this.createdAt;
  }
}

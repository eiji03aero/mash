import { date } from "../";

export interface ErrorBaseBasis { }

export class ErrorBase {
  createdAt: string;

  constructor () {
    this.createdAt = date.getCurrentTime();
  }

  message (): string {
    return this.createdAt;
  }
}

import {
  IService,
  IMash,
} from "../types";

export class Service implements IService {
  constructor (
    private mash: IMash,
  ) {}

  initialize (params: {
    terminalContainer: HTMLElement;
  }) {
    this.mash.initialize(params.terminalContainer);
  }
}

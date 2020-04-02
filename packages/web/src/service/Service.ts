import {
  IService,
  IMash,
} from "../types";

export const stubService = {
  initialize (_: {
    terminalContainer: HTMLElement;
  }) {},
};

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

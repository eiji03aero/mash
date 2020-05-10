import * as E from "fp-ts/lib/Either";

import { ILocalStore } from "../../types";

export class LocalStore implements ILocalStore {
  getToken (): E.Either<null, string> {
    const token = window.localStorage.getItem("token");
    return E.fromNullable(null)(token);
  }

  saveToken (token: string) {
    window.localStorage.setItem("token", token);
  }


  clearToken () {
    window.localStorage.removeItem("token");
  }
}

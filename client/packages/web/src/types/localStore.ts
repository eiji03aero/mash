import * as E from "fp-ts/es6/Either";

export interface ILocalStore {
  getToken(): E.Either<null, string>;
  saveToken(token: string): void;
  clearToken(): void;
}

import * as E from "fp-ts/es6/Either";
import * as types from "../../types";
import { gen } from "../../graphql";

export class AuthRepository implements types.IAuthRepository {
  private _apolloClient: types.CustomApolloClient;

  constructor (params: {
    apolloClient: types.CustomApolloClient;
  }) {
    this._apolloClient = params.apolloClient;
  }

  async signup (params: {
    name: string;
    password: string;
  }): types.PromisedEither<null> {
    const result = await this._apolloClient.mutate({
      mutation: gen.SignupDocument,
      variables: {
        input: {
          name: params.name,
          password: params.password,
        }
      }
    })
      .catch(err => err);
    if (result instanceof Error) {
      return E.left(result);
    }

    return E.right(null);
  }

  async login (params: {
    name: string;
    password: string;
  }): types.PromisedEither<string> {
    const result = await this._apolloClient.mutate({
      mutation: gen.LoginDocument,
      variables: {
        input: {
          name: params.name,
          password: params.password,
        }
      }
    })
      .catch(err => err);
    if (result instanceof Error) {
      return E.left(result);
    }

    return E.right(result.data.login.token);
  }

  async logout (): types.PromisedEither<null> {
    const result = await this._apolloClient.mutate({
      mutation: gen.LogoutDocument,
    })
      .catch(err => err);
    if (result instanceof Error) {
      return E.left(result);
    }

    return E.right(null);
  }
}

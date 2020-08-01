import * as E from "fp-ts/lib/Either";

import {
  CustomApolloClient,
  IProxy,
  PromisedEither,
} from "../../types";
import { tags } from "../../graphql";

export class Proxy implements IProxy {
  private _apolloClient: CustomApolloClient;

  constructor (params: {
    apolloClient: CustomApolloClient;
  }) {
    this._apolloClient = params.apolloClient;
  }

  async signup (params: {
    name: string;
    password: string;
  }): PromisedEither<null> {
    const result = await this._apolloClient.mutate({
      mutation: tags.mutations.Signup,
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
  }): PromisedEither<string> {
    const result = await this._apolloClient.mutate({
      mutation: tags.mutations.Login,
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

  async logout (): PromisedEither<null> {
    const result = await this._apolloClient.mutate({
      mutation: tags.mutations.Logout,
    })
      .catch(err => err);
    if (result instanceof Error) {
      return E.left(result);
    }

    return E.right(null);
  }
}

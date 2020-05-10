import * as E from "fp-ts/lib/Either";

import { CustomApolloClient, IProxy } from "../../types";
import { tag } from "../../graphql";

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
  }): Promise<E.Either<Error, null>> {
    const result = await this._apolloClient.mutate({
      mutation: tag.mutations.Signup,
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
  }): Promise<E.Either<Error, string>> {
    const result = await this._apolloClient.mutate({
      mutation: tag.mutations.Login,
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

  async logout (): Promise<E.Either<Error, null>> {
    const result = await this._apolloClient.mutate({
      mutation: tag.mutations.Logout,
    })
      .catch(err => err);
    if (result instanceof Error) {
      return E.left(result);
    }

    return E.right(null);
  }
}

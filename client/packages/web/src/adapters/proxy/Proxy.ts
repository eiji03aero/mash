import { Monad, Either, Errors } from "mash-common";

import { CustomApolloClient, IProxy } from "../../types";
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
  }): Promise<Either> {
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
      return Monad.either.left(Errors.Factory.standard(Error.toString()));
    }

    return Monad.either.right(null);
  }
}

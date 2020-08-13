import * as E from "fp-ts/es6/Either";
import * as types from "../../types";
import { gen } from "../../graphql";

export class LocalStateRepository implements types.ILocalStateRepository {
  private _apolloClient: types.CustomApolloClient;

  constructor (params: {
    apolloClient: types.CustomApolloClient;
  }) {
    this._apolloClient = params.apolloClient;
  }

  async get (): types.PromisedEither<gen.LocalState> {
    const result = this._apolloClient.readQuery<{ localState: gen.LocalState }>({
      query: gen.GetLocalStateDocument,
    });
    if (!result) {
      return E.left(new Error("could not fetch local state"));
    }

    return E.right(result.localState);
  }

  async update (params: Partial<gen.LocalState>): types.PromisedEither<null> {
    const r1 = await this.get();
    if (E.isLeft(r1)) {
      return r1;
    }
    const localState = r1.right;

    const updatedLocalState = Object.assign<
      gen.LocalState, gen.LocalState, Partial<gen.LocalState>
    >({} as gen.LocalState, localState, params);
    this._apolloClient.writeQuery({
      query: gen.GetLocalStateDocument,
      data: {
        localState: updatedLocalState,
      }
    });

    return E.right(null);
  }
}

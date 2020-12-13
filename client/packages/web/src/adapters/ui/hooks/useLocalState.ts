import { useQuery, QueryResult } from "@apollo/client";
import { gen } from "../../../graphql";

type LocalStateRes = {
  localState: gen.LocalState;
};

export const useLocalState = (): QueryResult<LocalStateRes, Record<string, any>> => {
  return useQuery<LocalStateRes>(gen.GetLocalStateDocument);
};

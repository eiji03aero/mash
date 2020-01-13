import { Request, Response } from "express";
import graphqlHTTP from "express-graphql";

import schema from "./schema";
import resolvers from "./resolvers";
import { getContext } from "./context";

export const graphqlHandler = async (req: Request, res: Response) => {
  return graphqlHTTP({
    schema,
    context: getContext(req, res),
    rootValue: resolvers,
  });
};

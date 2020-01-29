import express from "express";
import { ApolloServer } from "apollo-server-express";
import logger from "morgan";

import { typeDefs, resolvers } from "./graphql";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/graphql_ws",
    onConnect: () => console.log("subsc on connect"),
  },
});

server.applyMiddleware({
  app,
  path: "/graphql",
});

export {
  app,
  server
};

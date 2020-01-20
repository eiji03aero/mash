import express from "express";
import logger from "morgan";
import { graphqlHandler } from "./graphql";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/graphql", graphqlHandler);

export default app;

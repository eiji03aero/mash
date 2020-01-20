import app from "../app";
import mongoose from "mongoose";
import { getDbUrlFromEnv, connectOption } from "../mongo";
import debugModule from "debug";
import http from "http";
import dotenv from "dotenv";

dotenv.config();
const debug = debugModule("express-test:server");

const port = process.env.PORT || "8090";
app.set("port", port);

const server = http.createServer(app);
server.listen(port);

server.on("error", (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("listening", () => {
  const addr = server.address() || "";
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);

  const { DB_NAME } = process.env;
  const dbUrl = getDbUrlFromEnv() + "/" + DB_NAME;
  mongoose.connect(dbUrl, connectOption, (err: Error) => {
    if (err) {
      debug("mongodb connection failed");
      process.exit(1);
    }
    else {
      debug("connected to mongodb");
    }
  });
});

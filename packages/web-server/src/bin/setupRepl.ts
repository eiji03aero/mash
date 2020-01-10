import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectOption, getDbUrlFromEnv } from "../mongo";

export { File } from "../models/File";

console.log("starting setup repl ...")
dotenv.config();

mongoose.connect(`${getDbUrlFromEnv()}/${process.env.DB_NAME}`, connectOption, (err: Error) => {
  if (err) {
    console.log("had error: ", err);
    process.exit(1);
  }

  console.log("done setup!");
});


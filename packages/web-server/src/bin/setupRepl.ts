import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectOption, getDbUrlFromEnv } from "../mongo";

import { File } from "../models/File";

console.log("starting setup repl ...")
dotenv.config();

(async () => {
  await mongoose.connect(`${getDbUrlFromEnv()}/${process.env.WEB_SERVER_DB_NAME}`, connectOption);
  Object.defineProperty(global, "File", {
    value: File
  });
  console.log("done setup!")
})();

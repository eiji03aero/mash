import app from "../app";
import mongoose from "mongoose";
import { getDbUrlFromEnv, connectOption } from "../mongo";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(`${getDbUrlFromEnv()}/${process.env.DB_NAME}`, connectOption, (err: Error) => {
  if (err) {
    console.error("could not connect", err);
    process.exit(1);
  }

  app();
})

import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app";
import { getDbUrlFromEnv, connectOption } from "../mongo";

dotenv.config();

mongoose.connect(getDbUrlFromEnv(), connectOption, (err: Error) => {
  if (err) {
    console.error("could not connect", err);
    process.exit(1);
  }

  app();
})

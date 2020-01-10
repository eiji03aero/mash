import mongoose from "mongoose";
import { IDirectory } from "../types";
import { fileSchema } from "./File";

const directorySchema = new mongoose.Schema({
  name: String,
  files: [fileSchema],
  directories: [this],
}, {
  timestamps: true
});

export const Directory = mongoose.model<IDirectory>("Directory", directorySchema);

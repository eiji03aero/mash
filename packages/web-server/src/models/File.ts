import mongoose from "mongoose";
import { IFile } from "../types";

export const fileSchema = new mongoose.Schema({
  name: String,
  content: String,
}, {
  timestamps: true
});

export const File = mongoose.model<IFile>("File", fileSchema);

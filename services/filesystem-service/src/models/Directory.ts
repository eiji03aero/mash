import mongoose from "mongoose";
import { IFile, IDirectory } from "../types";
import { fileSchema } from "./File";

export const directorySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  files: {
    type: [fileSchema],
    default: [],
  },
  directories: {
    type: [this],
    default: [],
  },
}, {
  timestamps: true
});

directorySchema.methods.serialize = function () {
  const fileIds = this.files.map((f: IFile) => f.id);
  const directoryIds = this.files.map((d: IDirectory) => d.id);
  return {
    cid: this.id,
    name: this.name,
    children: [].concat(fileIds, directoryIds),
  };
};

export const Directory = mongoose.model<IDirectory>("Directory", directorySchema);

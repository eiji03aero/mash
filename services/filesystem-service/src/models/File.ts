import mongoose from "mongoose";
import { IFile } from "../types";

export const fileSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
}, {
  timestamps: true
});

fileSchema.methods.serialize = function () {
  return {
    cid: this._id,
    name: this.name,
    content: this.content,
  };
};

export const File = mongoose.model<IFile>("File", fileSchema);

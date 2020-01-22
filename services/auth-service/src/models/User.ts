import mongoose from "mongoose";
import { IUser } from "../types";
import * as utils from "../utils";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rememberToken: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});


userSchema.pre<IUser>("save", async function (next: mongoose.HookNextFunction) {
  if (this.isModified("password")) {
    this.password = await utils.encodeString(this.password);
  }

  next();
});


userSchema.methods.comparePassword = async function (password: string) {
  return utils.compareEncodedStrings(password, this.password);
};


export const User = mongoose.model<IUser>("User", userSchema);

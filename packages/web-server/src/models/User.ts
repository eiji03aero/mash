import mongoose from "mongoose";
import { IUser } from "../types";
import { Directory, directorySchema } from "./Directory";
import { File } from "./File";
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
  homeDirectory: {
    type: directorySchema,
    required: true,
  },
}, {
  timestamps: true,
});


userSchema.pre<IUser>("validate", async function (next: mongoose.HookNextFunction) {
  if (!this.homeDirectory) {
    this.homeDirectory = await Directory.create({ name: "home", ownerId: this.id });
  }
  next();
});

userSchema.pre<IUser>("save", async function (next: mongoose.HookNextFunction) {
  if (!this.isModified("password")) return next();

  this.password = await utils.encodeString(this.password);
  next();
});


userSchema.methods.comparePassword = async function (password: string) {
  return utils.compareEncodedStrings(password, this.password);
};

userSchema.methods.files = async function () {
  return await File.find({ ownerId: this.id });
};

userSchema.methods.directories = async function () {
  return await Directory.find({ ownerId: this.id });
};


export const User = mongoose.model<IUser>("User", userSchema);

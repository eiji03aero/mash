import mongoose from "mongoose";
import { ISystemProfile } from "../types";
import { Directory, directorySchema } from "./Directory";

export const systemProfileSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  rootDirectory: {
    type: directorySchema,
    required: true,
  },
}, {
  timestamps: true
});

systemProfileSchema.pre<ISystemProfile>("validate", async function (next: mongoose.HookNextFunction) {
  if (this.isNew) {
    this.rootDirectory = await Directory.create({name: "root", ownerId: this.id});
  }

  next();
});

export const SystemProfile = mongoose.model<ISystemProfile>("SystemProfile", systemProfileSchema);

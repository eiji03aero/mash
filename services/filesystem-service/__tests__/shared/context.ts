import mongoose from "mongoose";
import {
  connectOption,
  getDbUrlFromEnv,
  removeAllCollections,
  dropAllCollections
} from "../../src/mongo";
import { SystemProfile } from "../../src/models"

export const hasDbConnection = async (dbName?: string) => {
  beforeAll(async () => {
    const name = dbName || "test";
    await mongoose.connect(getDbUrlFromEnv(name), connectOption);
  });

  afterEach(async () => {
    await removeAllCollections();
  });

  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
  });
};

export const hasSystemProfile = async () => {
  const systemProfile = await SystemProfile.create({
    ownerId: mongoose.Types.ObjectId(),
  });
  return systemProfile;
};

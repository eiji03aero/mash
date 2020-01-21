import mongoose from "mongoose";
import {
  connectOption,
  getDbUrlFromEnv,
  // removeAllCollections,
  dropAllCollections
} from "../../src/mongo";
import { SystemProfile } from "../../src/models"

export const hasDbConnection = async (dbName?: string) => {
  beforeAll(async () => {
    const name = dbName || "test";
    const url = getDbUrlFromEnv() + "/" + name;
    await mongoose.connect(url, connectOption);
  });

  afterEach(async () => {
    // await removeAllCollections();
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

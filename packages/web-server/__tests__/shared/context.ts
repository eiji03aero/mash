import mongoose from "mongoose";
import { connectOption, getDbUrlFromEnv, removeAllCollections, dropAllCollections } from "../../src/mongo";

export const hasDbConnection = async (dbName: string) => {
  beforeAll(async () => {
    const url = getDbUrlFromEnv() + "/" + dbName;
    await mongoose.connect(url, connectOption);
  });

  afterEach(async () => {
    await removeAllCollections();
  });

  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
  });
};

import mongoose from "mongoose";
import { connectOption, getDbUrlFromEnv, removeAllCollections, dropAllCollections } from "../../src/mongo";
import { Signup } from "../../src/usecases";

export const hasDbConnection = async (dbName?: string) => {
  beforeAll(async () => {
    const name = dbName || "test";
    const url = getDbUrlFromEnv(name);
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

export const hasUser = async (_params: any = {}) => {
  const defaultParams = { name: "hoge", email: "hoge@gmail.com", password: "hogehoge" };
  const params = Object.assign(defaultParams, _params);
  const user = await (new Signup().execute(params));
  return user;
};

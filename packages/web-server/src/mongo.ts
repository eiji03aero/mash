import mongoose from "mongoose";

export const connectOption = { useNewUrlParser: true, useUnifiedTopology: true };

export const getDbUrlFromEnv = () =>
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

export const removeAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
};

export const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === "ns not found") return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes("a background operation is currently running")) return
      console.log(error.message)
    }
  }
}

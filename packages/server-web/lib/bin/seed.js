"use strict";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { User, File, Directory } from "../models";
// import { connectOption, getDbUrlFromEnv } from "../mongo";
//
// dotenv.config();
//
// mongoose.connect(`${getDbUrlFromEnv()}/${process.env.WEB_SERVER_DB_NAME}`, connectOption, async (err: Error) => {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }
//
//   const user = await User.create({name: "hoge", email: "hoge@gmail.com"});
//
//   const f1 = await File.create({name: "hoge"});
//   const f2 = await File.create({name: "domo"});
//   const f3 = await File.create({name: "kore ka"});
//
//   const d = await Directory.create({name: "hoge-parent"});
//   d.files.push(f1);
//   d.files.push(f2);
//   d.files.push(f3);
//   await d.save();
// });
//# sourceMappingURL=seed.js.map
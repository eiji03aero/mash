"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var mongo_1 = require("../mongo");
var File_1 = require("../models/File");
exports.File = File_1.File;
console.log("starting setup repl ...");
dotenv_1.default.config();
mongoose_1.default.connect(mongo_1.getDbUrlFromEnv() + "/" + process.env.DB_NAME, mongo_1.connectOption, function (err) {
    if (err) {
        console.log("had error: ", err);
        process.exit(1);
    }
    console.log("done setup!");
});
//# sourceMappingURL=setupRepl.js.map
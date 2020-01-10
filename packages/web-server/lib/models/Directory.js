"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var File_1 = require("./File");
var directorySchema = new mongoose_1.default.Schema({
    name: String,
    files: [File_1.fileSchema],
    directories: [this],
}, {
    timestamps: true
});
exports.Directory = mongoose_1.default.model("Directory", directorySchema);
//# sourceMappingURL=Directory.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
exports.fileSchema = new mongoose_1.default.Schema({
    name: String,
    content: String,
}, {
    timestamps: true
});
exports.File = mongoose_1.default.model("File", exports.fileSchema);
//# sourceMappingURL=File.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
exports.fileSchema = new mongoose_1.default.Schema({
    ownerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        default: "",
    },
}, {
    timestamps: true
});
exports.fileSchema.methods.serialize = function () {
    return {
        cid: this._id,
        name: this.name,
        content: this.content,
    };
};
exports.File = mongoose_1.default.model("File", exports.fileSchema);
//# sourceMappingURL=File.js.map
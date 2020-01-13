"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var File_1 = require("./File");
exports.directorySchema = new mongoose_1.default.Schema({
    ownerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    files: {
        type: [File_1.fileSchema],
        default: [],
    },
    directories: {
        type: [this],
        default: [],
    },
}, {
    timestamps: true
});
exports.directorySchema.methods.serialize = function () {
    var fileIds = this.files.map(function (f) { return f.id; });
    var directoryIds = this.files.map(function (d) { return d.id; });
    return {
        cid: this.id,
        name: this.name,
        children: [].concat(fileIds, directoryIds),
    };
};
exports.Directory = mongoose_1.default.model("Directory", exports.directorySchema);
//# sourceMappingURL=Directory.js.map
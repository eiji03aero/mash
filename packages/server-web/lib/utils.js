"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var saltRounds = 10;
exports.encodeString = function (str) {
    return bcrypt_1.default.hash(str, saltRounds);
};
exports.compareEncodedStrings = function (str, enstr) {
    return bcrypt_1.default.compare(str, enstr);
};
//# sourceMappingURL=utils.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var basename_1 = __importDefault(require("./basename"));
var cat_1 = __importDefault(require("./cat"));
var cd_1 = __importDefault(require("./cd"));
var dirname_1 = __importDefault(require("./dirname"));
var echo_1 = __importDefault(require("./echo"));
var ls_1 = __importDefault(require("./ls"));
var mkdir_1 = __importDefault(require("./mkdir"));
var pwd_1 = __importDefault(require("./pwd"));
var rm_1 = __importDefault(require("./rm"));
var touch_1 = __importDefault(require("./touch"));
exports.builtins = {
    basename: basename_1.default,
    cd: cd_1.default,
    dirname: dirname_1.default,
    echo: echo_1.default,
    pwd: pwd_1.default,
    touch: touch_1.default,
    mkdir: mkdir_1.default,
    ls: ls_1.default,
    cat: cat_1.default,
    rm: rm_1.default,
};
//# sourceMappingURL=index.js.map
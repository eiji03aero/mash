"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var v4_1 = __importDefault(require("uuid/v4"));
var models_1 = require("../models");
var UserAPI = /** @class */ (function () {
    function UserAPI() {
    }
    UserAPI.prototype.signup = function (_a) {
        var name = _a.name, email = _a.email, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = new models_1.User({ name: name, email: email, password: password });
                        return [4 /*yield*/, user.save()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserAPI.prototype.login = function (_a) {
        var email = _a.email, password = _a.password, res = _a.res;
        return __awaiter(this, void 0, void 0, function () {
            var user, isCorrectPassword, cookieOption;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, models_1.User.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (user === null)
                            return [2 /*return*/, new Error("user not found")];
                        return [4 /*yield*/, user.comparePassword(password)];
                    case 2:
                        isCorrectPassword = _b.sent();
                        if (!isCorrectPassword)
                            return [2 /*return*/, new Error("password not correct")];
                        user.rememberToken = v4_1.default();
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _b.sent();
                        cookieOption = {
                            path: "/",
                            expires: new Date(Date.now() + 3600 * 24 * 365 * 20),
                        };
                        res.cookie("userId", user.id, cookieOption);
                        res.cookie("rememberToken", user.rememberToken, cookieOption);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserAPI.prototype.logout = function (_a) {
        var email = _a.email, res = _a.res;
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, models_1.User.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (user === null)
                            return [2 /*return*/, new Error("user not found")];
                        user.rememberToken = "";
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        res.clearCookie("userId");
                        res.clearCookie("rememberToken");
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return UserAPI;
}());
exports.UserAPI = UserAPI;
//# sourceMappingURL=UserAPI.js.map
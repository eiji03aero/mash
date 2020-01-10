"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("../app"));
var mongoose_1 = __importDefault(require("mongoose"));
var mongo_1 = require("../mongo");
var debug_1 = __importDefault(require("debug"));
var http_1 = __importDefault(require("http"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var debug = debug_1.default("express-test:server");
var port = process.env.SERVER_PORT || "8090";
app_1.default.set("port", port);
var server = http_1.default.createServer(app_1.default);
server.listen(port);
server.on("error", function (error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on("listening", function () {
    var addr = server.address() || "";
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    debug("Listening on " + bind);
    var DB_NAME = process.env.DB_NAME;
    var dbUrl = mongo_1.getDbUrlFromEnv() + "/" + DB_NAME;
    mongoose_1.default.connect(dbUrl, mongo_1.connectOption, function (err) {
        if (err) {
            debug("mongodb connection failed");
            process.exit(1);
        }
        else {
            debug("connected to mongodb");
        }
    });
});
//# sourceMappingURL=www.js.map
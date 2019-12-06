"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.either = {
    left: function (err) {
        return { isError: true, error: err };
    },
    right: function (value) {
        return { isError: false, value: value };
    },
    isLeft: function (e) {
        return e.isError;
    },
    isRight: function (e) {
        return !e.isError;
    }
};
//# sourceMappingURL=either.js.map
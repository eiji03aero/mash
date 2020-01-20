"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
exports.default = graphql_1.buildSchema("\n  type Query {\n    message: String\n    nodes: FileSystemNodes\n  }\n\n  type FileSystemNodes {\n    directories: [Directory]!\n    files: [File]!\n  }\n\n  type Directory {\n    cid: String!\n    name: String\n    children: [ID]!\n  }\n\n  type File {\n    cid: Stinrg!\n    name: String\n    content: String\n  }\n");
//# sourceMappingURL=schema.js.map
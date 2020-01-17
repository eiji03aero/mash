import { buildSchema } from "graphql";

export default buildSchema(`
  type Query {
    message: String
    nodes: FileSystemNodes
  }

  type FileSystemNodes {
    directories: [Directory]!
    files: [File]!
  }

  type Directory {
    cid: String!
    name: String
    children: [ID]!
  }

  type File {
    cid: Stinrg!
    name: String
    content: String
  }
`);

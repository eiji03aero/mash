export const typeDefs = `
  type Query {
    message: String
    nodes: FileSystemNodes
  }

  type Subscription {
    hello: String
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
    cid: String!
    name: String
    content: String
  }
`;

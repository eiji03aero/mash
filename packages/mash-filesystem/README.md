# Mash-Filesystem

## models

- FileSystem

- FileSystemNode
  - Directory
  - File

### FileSystem

- singleton instance

- property
  - currentDirectory: Directory
  - root: Directory

- instance methods
  - changeCurrentDirectory(params): ({err})
  - createFile(params): ({err})
  - createDirectory(params): ({err})
  - updateFile(params): ({err})
  - updateDirectory(params): ({err})
  - deleteNode(params): ({err})
  - readFile(params, (err, content) => void): void
  - readDirectory(params, (err, content) => void): void

- private instance methods
  - isRoot(node: FileSystemNode): boolean
  - resolveNodeFromPath:(path: string): FileSystemNode

### FileSystemNode

- property
  - cid: string
  - name: string
  - parentNode: FileSystemNode
  - createdAt: string

- instance methods
  - setParentNode(node: FileSystemNode): void
  - removeParentNode(node: FileSystemNode): void

### Directory < FileSystemNode

- property
  - &FileSystemNode
  - children: FileSystemNode[]
  - `__root__`: boolean

- instance methods
  - addChild(node: FileSystemNode): void
  - removeChild(node: FileSystemNode): void
  - containsByName(name: string): boolean
  - findByName(name: string): FileSystemNode
  - isRoot

### File < FileSystemNode

- property
  - &FileSystemNode
  - content: string

- instance methods
  - setContent(content: string): void

## apis

- get current directory path

- change current directory

- resolve file from path
  - relative path
  - absolute path

- create file/directory

- update file/directory

- delete file/directory

- read the content of file

- list the nodes in a directory

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
  - changeCurrentDirectory(): void
  - resolveNodeFromPath:(path: string): FileSystemNode
  - createFile
  - createDirectory
  - updateNode
  - deleteNode
  - readNode

- private instance methods
  - isRoot(node: FileSystemNode): boolean

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

- instance methods
  - addChild(node: FileSystemNode): void
  - removeChild(node: FileSystemNode): void
  - containsByName(name: string): boolean
  - findByName(name: string): FileSystemNode

### File < FileSystemNode

- property
  - &FileSystemNode
  - content: string

- instance methods
  - setContent(content: string): void

## apis

- get current directory path

- change current directory

- reolve file from path
  - relative path
  - absolute path

- create file/directory

- update file/directory

- delete file/directory

- output the content of file

- list the nodes in a directory

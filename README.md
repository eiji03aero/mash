# mash

## Packages

- mash
  - mama's shell runtime
- mash-filesystem
  - filesystem for mash
- mash-term
  - terminal-ish canvas module
- mash-common
  - shared stuff

## Todos

```
- whole
  - [WIP] should create package provide environment including filesystem?
    - not to do this for now. keep them inside mash
  - how text treated
    - should be just string with dedicated escape sequence
  - replace tslint with eslint typescript-eslint
- mash
  - [WIP] refactor token for commandline and program
    - kind of don't know what to do
  - [WIP] add usage for all the commands
    - should be after figuring out apis on term and environment
  - tbd features
    - string interpolation
    - rm -f
      - need to create access to prompt for commands
    - ls command
      - align feature
    - test command
    - grep command
    - pipe
    - redirect
    - argument variables
    - let user defined script run
- mash-filesystem
  - refactor FileSystemNode.parentNode
    - try to remove optional from this property
    - have private and create getter/setter. if it doesn't exist, thorw
  - serialize nodes for saving
- mash-common
- mash-term
  - clear window
    - just update the rowPosition and render empty
  - update by row index
  - prompt feature
    - something like making use of Promise. probably delegating key handler completely?
  - window related features
    - number of column
    - number of row
- web
  - create basis
    - react
    - graphql
- web-server
  - Node
  - graphql
  - mongodb?
```

## Structure

```

- Environment
  - exitStatus
  - stdin
  - stdout
  - stderr
  - screenWidth
```

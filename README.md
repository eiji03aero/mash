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
  - should change how text treated? should be just string with dedicated escape sequence?
  - add linter
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
  - refactor FileSystem with Either
    - resolveNodeFromPath
  - serialize nodes for saving
- mash-common
  - paths util
    - dirname
    - basename
- mash-environment
  - properties
    - term
    - fileSystem
    - mash
  - apis
    - acquire terminal width (character length?)
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

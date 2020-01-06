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
  - serialize nodes for saving
- mash-common
- mash-term
  - add test
  - tbd
    - delete row by index
- web
  - create basis
    - react
    - graphql
- web-server
  - features
    - add base skelton based on express generator
    - user account feature
    - fetch filesystem
      - if logged in, get the ones for them in home directory
      - if not, get only the default ones
    - thread feature
      - user posts something
      - user can create thread
      - can subscribe to thread

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

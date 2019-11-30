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
- mash
  - have util function to parse command line option arguments for commands
  - [WIP] refactor token for commandline and program
    - kind of don't know what to do
  - commands (along with test)
    - dirname
    - basename
    - touch
    - mkdir
    - ls
    - cat
    - rm
      - option -rf
        - have to ponder on how to parse
      - environment should have yesno function
  - write test
  - tbd features
    - string interpolation
    - test command
    - grep command
    - pipe
    - redirect
    - argument variables
    - let user defined script run
- mash-filesystem
  - serialize nodes for saving
- mash-common
- web
  - create basis
    - react
    - restful? graphql?
```

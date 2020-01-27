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
- web
  - web app for mash

## Services
- frontend-service
  - the server for mash
- auth-service
  - auth kind of server
- filesystem-service
  - filesystem server

## Todos

```
- whole
  - none

- mash
  - move the commands to web when ready
  - have context object on run so that we can pass external apis to commands
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
  - re-consider internal representation of nodes, like having map of id/node
    - add NodeStore class to handle stuff
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

- frontend-service
  - features
    - user account feature
      - signup
        - create user
      - login
        - set cookie with signed password
      - logout
        - remove cookie
    - fetch filesystem
      - if logged in, get the ones for them in home directory
      - if not, get only the default ones
    - thread feature
      - user posts something
      - user can create thread
      - can subscribe to thread

- auth-service

- filesystem-service
  - deal with types on CIFile and CIDirectory
```

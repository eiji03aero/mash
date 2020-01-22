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

## Todos

```
- whole
  - setup tests for services
    - try to see if separate build pipeline is possible with github action
  - try to remove lib/ directory from git
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
  - consider internal representation of nodes, like having map of id/node
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
  - create SystemProfile and refactor related codes in File and Directory
  - deal with types on CIFile and CIDirectory
  - models
    - File
    - Directory
    - SystemProfile
```

# mash

## Packages

- mash
  - mama's shell runtime
- mash-filesystem
  - filesystem for mash
- mash-term
  - terminal-ish canvas module
- mash-viewer
  - to view the pages with filesystem explorer
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
- term-service?
  - mada wakaran
  - possible features
    - command history
- m-chan-service
  - provides m-chan related service

## Todos

```
- whole
  fix
    - none for now
  feature
    - add Buffer class
      - add command history feature
    - add tab completion
    - dynamically change prompt
      - like current directory
    - let multiple single character be parsed
      - something like -rf, vise versa as well (-fr)
    - cursor up/down to move history

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
  - deserialize nodes
    - for static files/dirs
  - serialize nodes for saving

- mash-common

- mash-term
  - add test
  - tbd
    - delete row by index

- web
  - start integrating components
    - keep in mind that mash should have a refactor around context object
  - setup tests

- mash-viewer
  - features
    - switch display markdown/raw text
    - display react component
    - file explorer along with filesystem nodes

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
      - only the home directory fetched from BE
      - loads static nodes from yaml

    - thread feature
      - user posts something
      - user can create thread
      - can subscribe to thread

- auth-service

- filesystem-service
  - deal with types on CIFile and CIDirectory
```

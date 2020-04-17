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
- frontend
  - frontend server for backend
- auth
  - auth kind of server
- filesystem
  - filesystem server
- term-service?
  - mada wakaran
  - possible features
    - command history
- mchan
  - provides mchan related service

## Todos

```
# features
- user signup
  - todos
    - return error if already signed in
- user login
  - todos
    - return error if already signed in
    - wip with adding logic to login on auth
    - somehow second prompt gets overriden, while signup flow does not have this
  - flow
    - prompt user to input name and password
    - sends request
      - check existence and password
      - return okay if true
- user logout

# refactor
- create template stuff for client package
  - when adding next package

# fix
- cursor sometimes vanishes
  - eg after typed like crazy
  - should restart blinking when:
    - click the screen
    - hit keyboard
- read method is not really working
  - eg. prompt would be overridden by current after hitting enter
  - fix: the updating logic should be passed from outside

# packages
- mash
  - [WIP] refactor token for commandline and program
    - kind of don't know what to do
  - [WIP] add usage for all the commands
    - should be after figuring out apis on term and environment
  - let multiple single character be parsed
    - something like -rf, vise versa as well (-fr)
  - string interpolation
  - stat
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
  - command history feature
  - tab completion
  - delete row by index
  - dynamically change prompt
    - like current directory

- web
  - setup tests

- mash-viewer
  - features
    - switch display markdown/raw text
    - display react component
    - file explorer along with filesystem nodes

# services
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
```

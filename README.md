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
# issues
- client
  - mash-term

- backend
  - refactor mskit
    - there are tons of tedious work when using mskit. they should be simplified
    - pains
      - consuming events to replicate data
        - with current feature, consumers will have to keep track of every single events in order to
          have complete data
        - more concrete examples are required to plan how it can be extracted
  - deploy
    - gcp, kubernetes
  - add test
    - integration tests
      - example
          - https://github.com/george-e-shaw-iv/integration-tests-example
      - todo
        - script to teardown and setup test environment
        - create e2e package
          - add test
      - concern
        - services' awaiting time for rabbitmq
    - unit tests
      - look up examples on gql-gen
      - should setup github action when all done
      - to cover
        - domain
        - service

  - frontend service

- rabbitmq
  - queuing might be not really working
    - service launched after queueing message does not receive them when ready
    - have to read more about it on documents

- create template stuff for client package
  - when adding next package

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

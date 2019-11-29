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
  - should create package provide environment including filesystem?
- mash
  - have util function to parse command line option arguments for commands
  - refactor token for commandline and program
  - write test
    - Ast
    - Environment
    - Evaluator
    - builtins
- mash-common
  - refactor
    - TextObject related might as well be namespaced or at least renamed in Pascal case
    - put all the Errors related object under Errors
```

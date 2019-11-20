# Mash - Mama's shell

## Todos

```
- refactor CommandLine
  - update arguments
    - option arguments in different property
    - anything else is normal arguments
- make Lexer put option arguments in separate token
```

## models

- Lexer
- Token

- Parser
- Program
- ASTNode
  - Statement
    - CommandLineStatement
    - PipeStatement
    - AndStatement
    - OrStatement
  - Expression
    - InterpolationExpression

- Evaluator
- Environment
- Standard
  - StandardOut
  - StandardError

## features

- execute CommandLine
  - returns STDOUT
  - returns STDERR

- STDOUT interpolation
  - should be evaluated in evaluator

- Pattern interpolation
  - should be evaluated in evaluator

- define variable

- pipe

- logical operators, works based on exit status
  - &&
  - ||

- parse arguemnt
  - put all the arguments in [$@]


## buildin functions

- echo
- cd
- dirname
- basename
- ls
- mkdir
- touch
- rm
- open
- cat
- pwd
- sleep

### TBD

- grep

- :

- read

- >

- [

- interpolation
  - ${}: in string
  - $(): in evaluation spot

- heredocument

- argument variables
  - $[0-9]: arguments passed to
  - $@: contains all the arguments
  - $#: number of arguments
  - $?: the previous exit status


## examples

```sh

$ echo hoge # => hoge
$ ls # => hoge huga
$ echo 'domo'
$ touch hoge.{,umu}.txt
```

## Memo

- color attributes should be on the format that bash uses
- when piped, attributes for color should be removed

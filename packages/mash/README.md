# Mash - Mama's shell runtime

## models

- Lexer
- Token

- Parser
- Program
  nodes: AstNode[]
- ASTNode
  - AstProgram
  - AstCommandLine
    - args: Token[]
  - AstString
    - value: string

- Evaluator
- Environment

## features

- functions
  - parseArgs
    - arguments
    - args: Token[]
      - { optionArgs: { optionKeys: string[], hasValue: boolean }[] }
    - return
      - { args: string[], optionArgs: {[index:string]: string} }

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

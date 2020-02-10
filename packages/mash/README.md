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

- MashClient<T extends IContext>
  - #eval(str: string, cmdMap: ICommandMap<T>, context: T)
    - flow
      - new Environment
      - new Lexer
      - new Parser
      - new Evaluator
      - evaluator.eval

- Environment

- IContext
  - onWrite(cb): void
  - ? onUpdateColumns(cb): void

- ICommandMap<T>
  [index: string]: CommandFunction<T>

- CommandFunction<T>
  (args: string[], context: T) => void

term new Term
env new Env
env.eval(str, context)

## features

- functions
  - parseArgs
    - arguments
    - args: Token[]
      - { optionArgs: { optionKeys: string[], hasValue: boolean }[] }
    - return
      - { args: string[], optionArgs: {[index:string]: string} }

## builtin functions

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

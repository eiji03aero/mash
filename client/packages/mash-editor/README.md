# Mash-editor

## Apis
- phase 1
  - todos
    - [x] implement open method on engine
      - create buffer if not found
    - [ ] select to open file
      - display cursor and focused line
      - hjkl to move cursor
        - keep cursor position for buffer basis
      - enter to open file in buffer
        - add field to indicate modifiable
  - BufferWindow
    - [x] display file content
    - [ ] Ctrl-W hjkl to move focus
    - [ ] show normal mode
    - [ ] show file name
    - [ ] show directory path
  - Filer
    - [x] view current directory
    - [ ] select to open the file
    - [ ] select to collapse the directory
  - CommandLine
    - [ ] :q/quit close vim
    - [ ] :h/help show help
- phase 2
  - save current buffer
  - insertmode
  - edit file content
  - create file on filer
  - create file/directory on filer

## Models

### EditorEngine
- wrapps everything required.
- exposes the available operation.
- supposed to be initialized and passed by client code

### Service
- application service for mash-viewer
- properties
  - bufferWindowManager: BufferWindowManager

### Buffer
- base class for buffers

### FileBuffer < Buffer
- represents buffer

### Filer < Buffer
- represents filer instance

### BufferWindow
- represents buffer window

### BufferWindowManager
- responsible for crud BufferWindows
- move scroll focus should be done here
- properties:
  - buffers: Buffer[]

### CommandLineService

### CommandLineParser
- accepts string to parse into primary command and arguments

## Components
### Editor
- Container component. Client code is supposed to use this in their react tree.
- props
  - engine: EditorEngine

### BufferWindow
- displays content, statusline
- props
  - contents: mash-common.Rows

### BufferContent
- displays content of buffer content. should memoize carefully
- scrolls by row

### CommandLine
- display command line window. displays current input, system message

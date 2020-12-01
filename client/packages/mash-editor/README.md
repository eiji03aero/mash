# Mash-editor

## Apis
### phase 1
- [x] implement open method on engine
  - create buffer if not found
- [x] select to open file
  - display cursor and focused line
    - add fields on Buffer
      - scrollLine: number
  - hjkl to move cursor
    - keep cursor position for buffer basis
    - gonna need dummy input element
      - to obtain focus
      - not to let extensions like vimium to steal key events
    - improve scroll behavior
      - scroll only when cursor is around the edge of window
  - Ctrl w + hl to move focus
  - improve filer
    - enter to open file in buffer
      - add field to indicate modifiable
    - enter to expand children
- [x] refactor how it's update state
  - remove the part which updates by utilizing state
  - add events to update each of them
- [x] add some commands
- [x] click on bufferwindow to move focus
- [x] refactor config related
  - now it lives in both context value and Editor state
- [x] fix overflow line issue
  - create helper on service to split lines
  - update stats related so that scroll (especially downwords) works properly
  - add scroller class and move all the scroll related logic there
    - move scroll method from base buffer
  - add cached rows on buffer. deal with scroll is too much of trouble
  - add resize handler. make sure to debounce
- [ ] implement status line
- BufferWindow
  - [x] display file content
  - [x] Ctrl-W hjkl to move focus
  - status line
    - [ ] show normal mode
    - [ ] show file name
    - [ ] show directory path
- Filer
  - [x] view current directory
  - [x] select to open the file
  - [x] select to collapse the directory
- CommandLine
  - [ ] :q/quit close vim
  - [ ] :h/help show help

### phase 2
- save current buffer
- insertmode
- edit file content
- create file on filer
- create file/directory on filer

### misc
- [ ] optimize render
  - memoize components

### commands
- common
  - normal
    - ctrl-w h, ctrl-w l
    - ctrl-d, ctrl-u
    - gg, G
- Filer
  - normal
    - Enter
    - o (toggle directory or open buffer)
    - x

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

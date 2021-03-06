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
- [x] implement status line
- [x] implement ruler
- [x] implement cursor
  - just add cursorColumn field
  - command to move cursor column
    - w, e, b
  - fix buffer row thing
    - move the adding caret and indent logic inside service#getFilerRows so that cursor
      calculation can be done properly
- [x] implement commandline
  - make it usable as error notifier
- BufferWindow
  - [x] display file content
  - [x] Ctrl-W hjkl to move focus
- StatusLine
  - [x] show normal mode
  - [x] show file name
  - [x] show directory path
- Filer
  - [x] view current directory
  - [x] select to open the file
  - [x] select to collapse the directory
- CommandLine
  - implement commands

### phase 2
- [x] update filesystem first
  - crud operation should have pre hook so that client code can insert request logic to do backend
    work before proceed
- [x] create file/directory on filer
  - service needs to have infoLines field
    - to show temporary texts
    - should be cleared when key up
- [x] edit file content
  - show insertmode
  - show dirty state
    - turn it on when write on insert mode
    - turn it off after save
  - update content of file
  - not to update the file if not modifiable
- [x] save current buffer
  - run filesystem#updatefile

### misc
- [ ] optimize render
  - memoize components

### commands
- common
  - normal
    - h, j, k, l
    - w, e, b
    - ctrl-w h, ctrl-w l
    - ctrl-d, ctrl-u
    - gg, G
- Filer
  - normal
    - Enter
    - o (toggle directory or open buffer)
    - x

### Ex commands
- q
  - quit vim
  - client code should listen for corresponding requestaction and do the actual closing
- h
  - show help
- e [path]
  - open buffer with path
- FilerToggle
  - toggle visibility of filer

## Models

### EditorEngine
- wraps everything required.
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

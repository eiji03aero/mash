# Mash-editor

## Apis
- phase 1
  - BufferWindow
    - display file content
    - Ctrl-W hjkl to move focus
    - show normal mode
    - show file name
    - show directory path
  - Filer
    - view current directory
    - select to open the file
    - select to collapse the directory
  - CommandLine
    - :q/quit close vim
    - :h/help show help
- phase 2
  - save current buffer
  - insertmode
  - edit file content
  - create file on filer
  - create file/directory on filer

## Models

### Service
- application service for mash-viewer
- property
  - FileSystem: mash-filesystem.FileSystem

### Buffer
- represents buffer
- property
  - id: string
  - nodeId: string
  - content: string

### Filer
- represents filer instance

### BufferWindow
- represents buffer window
- property
  - id: string
  - bufferId: string
  - filerId: string
  - mode: 'normal'
  - width: number

### ParseCommandLineService
- accepts string to parse into primary command and arguments

## Components

### BufferWindow
- displays content, statusline
- props
  - contents: mash-common.Rows

### BufferContent
- displays content of buffer content. should memoize carefully

### CommandLine
- display command line window. displays current input, system message

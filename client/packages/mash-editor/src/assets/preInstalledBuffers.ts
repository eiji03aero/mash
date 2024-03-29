import * as dmn from "../domain";

const formatString = (str: string) => str.trim();

export const help = new dmn.Buffer({
  name: "help.txt",
  nodeId: "",
  content: formatString(`
# mash-editor
- The official file editor for mash system.
- If you are vimmer, you know what to do. This editor covers usecases as much as possible,
  but the author of this editor is pretty much sure it would fail mighty vimmers' expectation (>< ;)

## keybinds
### Normal mode
#### common
- h
  - move cursor left
- j
  - move cursor down
- k
  - move cursor up
- l
  - move cursor right
- w
  - move cursor to next word's beginning
- e
  - move cursor to next word's ending
- b
  - move cursor to previous word's beginning
- ctrl-w h
  - move window focus to left
- ctrl-w l
  - move window focus to right
- ctrl-d
  - move cursor half page down
- ctrl-u
  - move cursor half page up
- gg
  - move cursor to top of buffer
- G
  - move cursor to botom of buffer
- ctrl-n t toggle visibility of buffer
- i
  - start insert mode
- a
  - start insert mode on next char
- :
  - start ex command mode

#### Filer specific
- Enter, o
  - if cursor on directory, toggle visibility of child nodes
  - if cursor on file, open content in buffer
- x
  - if cursor on directory, hide child nodes
- ma
  - create node
- mm
  - move node
- md
  - delete node

### Insert mode
#### common
- Ctrl-c, Esc
  - exit isnert mode

### Ex command mode
- h, help
  - args: none
  - show help
- q, quit
  - args: none
  - quit editor
- e, edit
  - args: [path]
  - open buffer
- FilerToggle
  - args: none
  - toggle visibility of filer
    `)
});

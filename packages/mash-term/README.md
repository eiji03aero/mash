# `mash-term`

# APIs

```
- focus/blur terminal
- type in string
  - Terminal#prompt
  - detect enter to emit the string
- show/hide cursor
- append lines
  - Terminal#write
- configure
  - Terminal#configure
    - prompt
    - background
- scroll
  - Terminal#onScroll
    - Renderer#onScroll
      - renderLayers[]#onScroll
```
